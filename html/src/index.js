import 'whatwg-fetch';

import {fire, off, on} from 'delegated-events';
import _ from 'lodash';
import moment from 'moment';

function resetEllipses() {
  $('.collapse').dotdotdot({
    height: 120,
    watch: true,
  });
}

function loadPosts(response) {
  sortByTimestamp(response.posts);
  response.posts.map(addPost);
  resetEllipses();
}

const postHtml = `
<div class="post">
  <div class="post-header">
    <h2 class="title-text">
    </h2>
    <span class="post-time time">
    </span>
  </div>
  <div class="img">
    <img class="square-image" />
    <h3 class="location-text"><span class="city-text"></span>, <span class="country-text"></span></h3>
  </div>
  <div class="stars">
      <button class="star-post-button">
        <img id="star-image" />
        Star it!</button>
          <span class="num-stars">
          </span> 
          Stars
    </div>
  <div class="text-container read-more-container">
    <div class="text collapse">
    </div>
    <button class="more-text">Read More</button>
  </div>
  <div class="comments-container read-more-container">
    <h3>Comments</h3>
    <div class="add-comment">
      <form name="comment_form">
        <label for="user">Name</label>
        <input name="user" type="text" placeholder="Your name..."></input>
        <br />
        <label for="content">Comment</label>
        <input name="content" type="text" placeholder="Add your comment..."></input>
        <br />
        <button class="submit">Submit</button>
      </form>
    </div>
    <div class="comments collapse">
    </div>
    <button type="submit" class="more-text">Expand Comments</button>    
  </div>
</div>
`;

function parseHtml(domString) {
  const parser = new DOMParser();
  const html = parser.parseFromString(domString, 'text/html');
  return html.body.firstChild;
}

function sortByTimestamp(list) {
  list.sort((a,b)=> moment(b.timestamp).unix() - moment(a.timestamp).unix());
}

function addPost(post) {
  const node = parseHtml(postHtml);
  node.setAttribute('data-post_id', post.id);
  node.querySelector('img').setAttribute('src', post.photo.url);
  node.querySelector('.title-text').innerText = post.title;
  node.querySelector('.post-time').innerText =
      moment(post.timestamp).calendar();
  node.querySelector('.city-text').innerText = post.location.city;
  node.querySelector('.country-text').innerText = post.location.country;
  node.querySelector('.text').innerHTML = post.content;
  node.querySelector('.num-stars').innerText = post.stars;
  node.querySelector('img#star-image').src = getStarUrl(post);
  addComments(node.querySelector('.comments'), post.comments);
  addPostNode(node);
}

function getStarUrl(post) {
  if (post.starred){
    return '/images/star.png'
  }
  else {
    return '/images/empty_star.png'
  }
}

function addComments(node, comments) {
  sortByTimestamp(comments);
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

const postsSelector = '#stream';

function addPostNode(node) {
  document.querySelector(postsSelector).appendChild(node);
}

function handleAddCommentResponse(target, response) {
  const commentsNode =
      target.closest('.comments-container').querySelector('.comments');
  commentsNode.innerHTML = '';
  addComments(commentsNode, response.comments);
}

function handleStarPostResponse(target, response) {
  target.closest('.post').querySelector('.num-stars').innerText =
      response.stars;
}


function postId(node) {
  return node.closest('.post').dataset.post_id;
}

function listenForComments() {
  on('click', 'form[name="comment_form"] button.submit', event => {
    const target = event.currentTarget;
    event.preventDefault();
    const form = target.closest('form');
    expandTarget(
        form.closest('.comments-container').querySelector('.more-text'));
    fetch('/add_post_comment', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        'post_id': postId(target),
        'name': form.elements.user.value,
        'comment': form.elements.content.value
      })
    })
        .then(response => response.json())
        .then(response => handleAddCommentResponse(target, response));
  });
}

function listenForStars() {
  on('click', '.star-post-button', event => {
    const target = event.currentTarget;
    const postNode = target.closest('.post');
    postNode.querySelector('img#star-image').src = '/images/star.png';
    event.preventDefault();
    fetch('/star_post', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        'post_id': postId(target),
      })
    })
        .then(response => response.json())
        .then(response => handleStarPostResponse(target, response));
  });
}

function expandTarget(target) {
  target.classList.add('hide');
  const text = target.closest('.read-more-container').querySelector('.collapse');
  if (text === null) {
    return;
  }
  text.classList.remove('collapse');
  $(text).dotdotdot({}).data('dotdotdot').restore();
}

function setupExpander() {
  on('click', '.more-text', e => {
    expandTarget(e.currentTarget);
  });
}

function setupHumburger() {
  document.querySelector("#humburger").onclick = event => {
    document.querySelector('#dropdown').classList.toggle("show");
  };
}

window.onload = () => {
  fetch('/posts').then(response => response.json()).then(loadPosts);
  listenForComments();
  listenForStars();
  setupHumburger();
  setupExpander();
};
