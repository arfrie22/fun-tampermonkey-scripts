// ==UserScript==
// @name        Campuswire Hammy Liker
// @namespace   Violentmonkey Scripts
// @match       https://campuswire.com/c/*
// @grant       none
// @version     1.1
// @author      -
// @description 2/15/2023, 10:10:41 PM
// @updateURL    https://github.com/arfrie22/fun-tampermonkey-scripts/raw/main/campus_wire_liker.user.js
// @grant       GM_setValue
// @grant       GM_getValue
// ==/UserScript==

const campuswire_class = "e69c10ed-2aab-4d71-9e40-1a40b586efbd";
const MAX_AGE = 1000 * 60 * 60 * 24 * 3; // 3 days
const NAME = "Hampton";

const LOG_CSS = 'background: #222; color: #bada55; font-size: 20px;';

if (window["GM_getValue"] == undefined) {
  window["GM_getValue"] = (_, res) => {return res};
  console.log("redef")
}

if (window["GM_setValue"] == undefined) {
  window["GM_setValue"] = () => {};
}

function checkPosts() {
  console.log("%cChecking posts", LOG_CSS);
  fetch(`https://api.campuswire.com/v1/group/${campuswire_class}/posts?number=70`, {
      "headers": {
          "accept": "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9",
          "authorization": `Bearer ${JSON.parse(window.localStorage["token"])}`,
      },
      "method": "GET"
  }).then(d => d.json()).then((posts) => {
      posts = posts.filter(d => d.type == "question")
      posts.forEach((post, index) => setTimeout(() => {
          let answeredAt = Date.parse(post.answeredAt);
          // console.log(`Looking at the post with ID: ${post.id}, seen: ${GM_getValue(`answered.${post.id}`, false)}, answered at: ${answeredAt}`);
          if (!GM_getValue(`answered.${post.id}`, false)) {
            fetch(`https://api.campuswire.com/v1/group/${campuswire_class}/posts/${post.id}/comments`, {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "en-US,en;q=0.9",
                    "authorization": `Bearer ${JSON.parse(window.localStorage["token"])}`,
                },
                "method": "GET"
            }).
            then(d => d.json()).then((comments) => {
                comments = comments.filter((comment) => comment.author.firstName == NAME && comment.answer == true);
                let answered = false;
                if (answered) {
                  console.log(`%cPost: ${post.id} has a ${NAME} answer`, LOG_CSS);
                }
                comments = comments.filter((comment) => comment.voted != true);
                comments.forEach((comment, index) => setTimeout(() => {
                        fetch(`https://api.campuswire.com/v1/group/${campuswire_class}/posts/${post.id}/votes`, {
                            "headers": {
                                "accept": "application/json, text/plain, */*",
                                "accept-language": "en-US,en;q=0.9",
                                "authorization": `Bearer ${JSON.parse(window.localStorage["token"])}`,
                            },
                            "body": JSON.stringify({
                                "comment": comment.id
                            }),
                            "method": "POST"
                        }).then(d => d.json()).then(() => {
                          answered = true;
                          console.log("%cLiked post", LOG_CSS)
                        })
                    },
                    100 * index))

                if (answered || Date.now() >= (Date.parse(answeredAt) || 0) + MAX_AGE) {
                  GM_setValue(`answered.${post.id}`, true);
                }
            })
          }
      }, 400 * index))
  });
}

checkPosts();
window.setInterval(checkPosts, 1000 * 60 * 10);
