// ==UserScript==
// @name         Z-library for NeoDB
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  add a shortcut link on NeoDB books for search book in Z-library.
// @author       shinechn
// @homepageURL  https://github.com/shinechn
// @supportURL   https://github.com/shinechn/zlibrary-for-neodb-script
// @match        https://neodb.social/book/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neodb.social
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501436/Z-library%20for%20NeoDB.user.js
// @updateURL https://update.greasyfork.org/scripts/501436/Z-library%20for%20NeoDB.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 等待页面完全加载
  window.onload = function () {

    //  search element by CSS Selectors
    const linkElement = document.querySelector("div[id='item-title'] .site-list");
    const bookTitleElement = document.querySelector("div[id='item-title'] h1");
    const targetUrl = 'https://z-library.sk'

    if (bookTitleElement) {
      // 获取书名文本
      const bookTitle = bookTitleElement.textContent.trim();

      // 创建一个新的链接元素
      var searchLink = document.createElement('a');
      searchLink.href = targetUrl + '/s/' + encodeURIComponent(bookTitle);
      searchLink.target = '_blank';
      searchLink.textContent = 'Z-library';
      searchLink.style.display = 'inline';
      searchLink.style.padding = '2px';
      searchLink.style.color = '#fff';
      searchLink.style.backgroundColor = '#72ADCE';

      // 将链接元素添加到 "linkElement" 元素之后
      linkElement.appendChild(searchLink);
    }
  };
})();
