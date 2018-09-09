import React from 'react';
import ReactDOM from 'react-dom';
import Comment from './Comment';
import assert from 'assert';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Comment comment="hello" />, div);
  console.log(div.querySelector('.content'));
  assert.equal(div.querySelector('.content'), "hello");
});