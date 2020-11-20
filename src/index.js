/* eslint-disable no-console */
/* eslint-disable radix */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable max-len */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import styled from 'styled-components';

const TolyComment = styled.span`
  border: none;
  color: #202020;
  font-family: Lucida Grande, Lucida Sans Unicode, Lucida Sans, Garuda, Verdana,
    Tahoma, sans-serif;
  font-size: 12px;
`;

const TolyUserComment = styled.span`
  border: none;
  color: #c0c0c0;
  font-family: Lucida Grande, Lucida Sans Unicode, Lucida Sans, Garuda, Verdana,
    Tahoma, sans-serif;
  font-size: 12px;
`;

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      comments: [],
    };
    this.getComments = this.getComments.bind(this);
  }

  componentDidMount() {
    const commentsId = window.location.pathname.substring(1);
    console.log(commentsId);
    console.log('worked');
    this.getComments(commentsId);
  }

  getComments(id) {
    axios.get(`/comments/${id}`).then((response) => {
      const comments = response.data.data;
      this.setState({
        comments,
      });
    });
  }

  render() {
    return (
      <div className="container">
        {this.state.comments.map((comment) => (
          <React.Fragment key={comment.comment_id}>
            <TolyUserComment>
              Frankie Roberts 4 at {parseInt(comment.time_stamp / 60)}:
              {comment.time_stamp % 60}
            </TolyUserComment>
            <br />
            <TolyComment>{comment.content} </TolyComment>
          </React.Fragment>
        ))}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#comments'));
