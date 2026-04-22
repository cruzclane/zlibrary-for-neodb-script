// ==UserScript==
// @name         Z-library for NeoDB
// @name:zh      NeoDB 的 Z-library
// @description  Add a shortcut link on NeoDB book pages to search the book in Z-library.
// @description:zh 在 NeoDB 书籍页添加 Z-library 快捷链接。
// @version      0.26.4
// @match        *://neodb.social/book/*
// @author       shinechn
// @license      MIT
// @namespace    http://tampermonkey.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neodb.social
// @homepageURL  https://github.com/shinechn/zlibrary-for-neodb-script
// @downloadURL  https://update.greasyfork.org/scripts/501436/Z-library%20for%20NeoDB.user.js
// @updateURL    https://update.greasyfork.org/scripts/501436/Z-library%20for%20NeoDB.meta.js
// ==/UserScript==

(function () {
  // Optional manual override; leave empty to fall back to cache or API.
  const DEFAULT_ZLIB_URL = '';

  // Fallback API used to resolve the current Z-library base URL.
  const ZLIB_API = 'https://resolve.js4.workers.dev/zlib';

  const LINK_SELECTOR = "div[id='item-title'] .site-list";
  const TITLE_SELECTOR = "div[id='item-title'] h1";

  const getCachedUrl = () => localStorage.getItem('zlib_url');
  const setCachedUrl = (url) => localStorage.setItem('zlib_url', url);

  const getLinkContainer = () => document.querySelector(LINK_SELECTOR);
  const getBookTitle = () =>
    document.querySelector(TITLE_SELECTOR)?.textContent?.trim();

  const requestJson = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  };

  async function fetchAndCacheUrl() {
    try {
      const response = await requestJson(ZLIB_API);
      const baseUrl = response?.data?.url;

      if (!baseUrl) return null;

      setCachedUrl(baseUrl);
      return baseUrl;
    } catch (error) {
      return null;
    }
  }

  const buildSearchUrl = (baseUrl, title) =>
    new URL(`/s/${encodeURIComponent(title)}`, baseUrl).toString();

  let toastTimer;

  function showToast(message) {
    document.querySelector('#zlib-toast')?.remove();

    const template = document.createElement('template');
    template.innerHTML = `
      <div id="zlib-toast" style="
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        padding: 10px 14px;
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.82);
        color: #fff;
        font-size: 14px;
        line-height: 1.4;
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
        pointer-events: none;
      ">${message}</div>
    `;

    const toast = template.content.firstElementChild;
    document.body.appendChild(toast);
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.remove(), 3000);
  }

  function insertZLibraryLink(baseUrl) {
    const linkElement = getLinkContainer();
    const bookTitle = getBookTitle();
    if (!linkElement || !bookTitle || !baseUrl) return;

    document.querySelector('#zlib-search-link')?.remove();

    const template = document.createElement('template');
    template.innerHTML = `
      <a id="zlib-search-link"
         class="zlib-search-link"
         target="_blank"
         rel="noopener noreferrer"
         style="margin-left: 10px; padding: 2px 4px; color: #fff; background-color: #72ADCE; border-radius: 4px; text-decoration: none; font-size: 0.85em;">
        Z-library
      </a>
    `;

    const searchLink = template.content.firstElementChild;
    searchLink.href = buildSearchUrl(baseUrl, bookTitle);
    linkElement.appendChild(searchLink);
  }

  async function init() {
    const zlibUrl =
      DEFAULT_ZLIB_URL || getCachedUrl() || (await fetchAndCacheUrl());
    if (!zlibUrl) {
      showToast('无法获取可用的 Z-library 地址，请稍后再试');
      return;
    }

    insertZLibraryLink(zlibUrl);
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
