import {fire, off, on} from 'delegated-events';
import _ from 'lodash';
import 'whatwg-fetch';
import moment from 'moment';

function parseHtml(domString) {
  const parser = new DOMParser();
  const html = parser.parseFromString(domString, 'text/html');    
  return html.body.firstChild;
}

function addComments(node, comments) {
  comments.map(comment => addComment(node, comment));
}

const commentHtml = `
<div class="comment">
  <h4>
    <span class="comment-title"></span>
    <span class="time"></span>
  </h4>
  <div class="content">
  </div>
</div>
`

function addComment(topNode, comment) {
  const node = parseHtml(commentHtml);
  node.querySelector('.comment-title').innerText = comment.name;
  node.querySelector('.content').innerText = comment.comment;
  node.querySelector('.time').innerText = moment(comment.timestamp).calendar();
  topNode.appendChild(node);
}

function handleAddCommentResponse(target, response) {
  const commentsNode = target.closest('.comments-container').querySelector('.comments');
  commentsNode.innerHTML = '';
  addComments(commentsNode, response.comments);
}

function listenForComments() {
  on('click', 'form[name="comment_form"] button.submit', event => {
    const target = event.currentTarget;
    event.preventDefault();
    const form = target.closest('form');
    fetch('/add_comment', {
      method: 'post',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        'name': form.elements.user.value,
        'comment': form.elements.content.value
      })
    })
      .then(response => response.json())
      .then(response => handleAddCommentResponse(target, response));
  });
}

function setupHumburger() {
  document.querySelector("#humburger").onclick = event => {
    document.querySelector('#dropdown').classList.toggle("show");
  };
}

window.onload = () => {
  const commentsNode = document.querySelector('.comments');
  fetch('/comments')
      .then(response => response.json())
      .then(response => addComments(commentsNode, response.comments));
  listenForComments();
  setupHumburger();
};
