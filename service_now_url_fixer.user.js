// ==UserScript==
// @name        Service now fixer
// @namespace   Violentmonkey Scripts
// @match       https://*.service-now.com/sc*.do
// @grant       none
// @version     1.1
// @author      Andrew Friedman
// @description 6/13/2023, 11:01:21 AM
// @updateURL   https://github.com/arfrie22/fun-tampermonkey-scripts/raw/main/service_now_url_fixer.user.js
// @downloadURL https://github.com/arfrie22/fun-tampermonkey-scripts/raw/main/service_now_url_fixer.user.js
// ==/UserScript==

let urlParts = window.location.href.split("/").slice();
let encodedURL = encodeURIComponent(urlParts[urlParts.length - 1]);
urlParts[urlParts.length - 1] = `now/nav/ui/classic/params/target/${encodedURL}`;
window.location.href = urlParts.join("/");
