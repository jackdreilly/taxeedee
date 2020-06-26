import React, { Component } from 'react'
import ReactSearchBox from 'react-search-box'
import './Search.css';

export default class Search extends Component {

	render() {
	  return (
	  	<div id="searchbar">
	    <ReactSearchBox
	      placeholder="Search for posts..."
	      data={this.props.posts.map(post => {return {
					key: post.id,
					value: `${post.location.country}, ${post.location.city}, ${post.title}`,
				};})}
	      onSelect={this.props.onSelect}
	      fuseConfigs={{
	        tokenize: true,
	        findAllMatches: true,
	      }}
	    />
	    </div>
	  )
	}
}