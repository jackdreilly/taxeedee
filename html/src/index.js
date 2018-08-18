import {fire, off, on} from 'delegated-events';
import _ from 'lodash';
import 'whatwg-fetch';
import moment from 'moment';

function resetEllipses() {
  $(".collapse").dotdotdot({
    height: 120,
    watch: true,
  });
}

function loadPosts(response) {
	response.posts.map(addPost);
	resetEllipses();
}

const postHtml = `
<div class="post">
  <h2 class="title-text"></h2>
  <div class="img">
    <img class="square-image" />
    <h3 class="location-text"></h3>
  </div>
  <div class="text-container read-more-container">
    <div class="text collapse">
		</div>
  	<button class="more-text">Expand Caption</button>
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

function addPost(post) {
	const node = parseHtml(postHtml);
	node.setAttribute('data-post_id', post.id);
	node.querySelector('img').setAttribute('src', post.photo.url);
	node.querySelector('.title-text').innerText = post.title;
	node.querySelector('.location-text').innerText = post.title;
	node.querySelector('.text').innerHTML = post.content;
	addComments(node.querySelector('.comments'), post.comments);
	addPostNode(node);
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

const postsSelector = '#stream';

function addPostNode(node) {
	document.querySelector(postsSelector).appendChild(node);
}

function handleAddCommentResponse(target, response) {
	const commentsNode = target.closest('.comments-container').querySelector('.comments');
	commentsNode.innerHTML = '';
	addComments(commentsNode, response.comments);
}

function postId(node) {
	return node.closest('.post').dataset.post_id;
}

function listenForComments() {
	on('click', 'form[name="comment_form"] button.submit', event => {
		const target = event.currentTarget;
		event.preventDefault();
		const form = target.closest('form');
		fetch('/add_post_comment', {
			method: 'post',
			headers: {
        "Content-Type": "application/json; charset=utf-8",
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


window.onload = () => {
  fetch('/posts')
      .then(response => response.json())
      .then(loadPosts);
  listenForComments();
  on('click', '.more-text', e => {
  	$(e.currentTarget).hide();
    const text = $(e.currentTarget).closest(".read-more-container").find(".collapse");
    text.removeClass("collapse");
    text.dotdotdot({}).data("dotdotdot").restore();
  });
  $("#humburger").click(function(event) {
    var humburger = document.querySelector("#dropdown");
    if (humburger.style.display === "none") {
        humburger.style.display = "block";
    } else {
        humburger.style.display = "none";
    }
  });  
};
