import React, { Component } from "react";
import {
  Panel,
  FormGroup,
  FormControl,
  Button,
  HelpBlock,
} from "react-bootstrap";

import "./BlogPost.css";

class BlogPost extends Component {


  constructor(props, context) {
    super(props, context);

    this.handleNewCommentChange = this.handleNewCommentChange.bind(this);
    this.loadComments = this.loadComments.bind(this);
    this.handleCommentCreate = this.handleCommentCreate.bind(this);

    this.noComments = {
      userName: "No comments yet.",
    };

    this.state = {
      blog: {
        title: "Loading blog...",
      },
      comments: [
        this.noComments,
      ],
      newComment: "",
    };
  }

  componentDidMount() {
    const blogId = this.props.match.params.id;
    this.callApi(blogId)
      .then((res) => {
        if(res) {
          this.setState({ blog: res });
          this.callCommentsApi(this.props.match.params.id)
            .then((res) => {
              if(res.length < 1) {
                res = [this.noComments];
              }
              this.setState({comments: res});
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
  }

  async callApi(id) {
    const response = await fetch(`/api/blog/${id}`);
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  async callCommentsApi(blogId) {
    const response = await fetch(`/api/comment?blogId=${blogId}`);
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  }

  async loadComments() {
    const blogId = this.props.match.params.id;

    this.callCommentsApi(blogId)
      .then((res) => {
        if(res.length < 1) {
          res = [this.noComments];
        }
        this.setState({comments: res});
      })
      .catch(err => console.log(err));
  }

  async handleCommentCreate() {
    const params = {
      body: this.state.newComment,
      userId: this.props.userId,
      userName: this.props.userName,
      blogId: this.props.match.params.id,
    }

    const requestParams = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(params)
    };

    const response = await fetch("/api/comment", requestParams);
    const body = await response.json();

    if (response.status !== 200 || !!body.error) {
      alert("There was an error. Please try again.");
      return false;
    }

    this.loadComments();
  }

  getValidationState() {
    if(this.state.newComment && this.state.newComment.length > 0){
      return "success";
    }
    return "error";
  }

  handleNewCommentChange(e) {
    const newComment = e.target.value;
    this.setState({ newComment });
  }

  handleCommentDelete(id) {
    this.deleteCommentApi(id)
      .then((res) => {
        this.loadComments();
      })
      .catch(err => alert("There was an error deleting th blog"));
  }

  async deleteCommentApi(id) {
    let deleteParams = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "DELETE",
    };
    const response = await fetch(`/api/comment/${id}`, deleteParams);

    if (response.status !== 200) throw Error(response.message);

    return true;
  };

  commentForm() {
    return (
      <Panel bsStyle="info">
        <Panel.Heading>Post a new comment</Panel.Heading>
        <Panel.Body>
          <form>
            <FormGroup
              controlId="comment"
              validationState={this.getValidationState()}
              >
              <FormControl
                type="text"
                value={this.state.newComment}
                onChange={this.handleNewCommentChange}
                />
              <FormControl.Feedback />
              <HelpBlock>Required</HelpBlock>
            </FormGroup>

            <Button
              onClick={this.handleCommentCreate}
              bsStyle="primary"
              >
              Post comment
            </Button>
          </form>
        </Panel.Body>
      </Panel>
    );
  }

  render() {
    return (
      <div className="blogPost">
        <Panel bsStyle="primary" bsClass="blogPostTitle">
          <Panel.Heading>{this.state.blog.title}</Panel.Heading>
          <Panel.Body>{this.state.blog.body}</Panel.Body>
        </Panel>
        { this.props.userId && this.commentForm() }
        {this.state.comments.map((comment, index) => {
          return (
            <Panel bsStyle="info" key={index}>
              <Panel.Heading>
                {
                  comment.userId ? (
                    <span>
                      <strong>{comment.userName}</strong> commented:
                    </span>
                  ) : (
                    <span>
                      <strong>{comment.userName}</strong>
                    </span>
                  )
                }
                {
                  this.props.userId === comment.userId &&
                  <Button
                    bsStyle="success"
                    onClick={ () => this.handleCommentDelete(comment._id)}
                    >
                    Delete
                  </Button>
                }
              </Panel.Heading>
              <Panel.Body>{comment.body}</Panel.Body>
            </Panel>
          );
        })}
      </div>
    );
  }
}

export default BlogPost;
