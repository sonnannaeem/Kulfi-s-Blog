import React, { Component } from "react";
import { Link, Redirect } from 'react-router-dom'
import {
  Button,
  FormControl,
  ControlLabel,
  HelpBlock,
  FormGroup
} from "react-bootstrap";

import './BlogForm.css';

class BlogForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.getTitleValidationState = this.getTitleValidationState.bind(this);
    this.handleDescChange = this.handleDescChange.bind(this);
    this.getDescValidationState = this.getDescValidationState.bind(this);
    this.handleBodyChange = this.handleBodyChange.bind(this);
    this.getBodyValidationState = this.getBodyValidationState.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.callApi = this.callApi.bind(this);

    this.state = {
      redirect: false,
      id: "",
      title: "",
      description: "",
      body: "",
      titleHelpText: "0/32 characters",
      descriptionHelpText: "0/128 characters",
      bodyHelpText: "0/512 characters",
    };
  }

  componentDidMount() {
    let blogId = this.props.match.params.id;
    if (blogId){
      this.getBlog(blogId)
        .then((res) => {
          if(res) {
            const titleHelpText = `${res.title.length}/128 characters`
            const descriptionHelpText = `${res.description.length}/128 characters`
            const bodyHelpText = `${res.body.length}/128 characters`
            if(this.props.userId !== res.userId) {
              alert("You cannot edit this blog! Submitting it will create a new blog.");
              blogId = "";
            }
            this.setState({
              id: blogId,
              title: res.title,
              description: res.description,
              body: res.body,
              titleHelpText,
              descriptionHelpText,
              bodyHelpText,
            });
          }
        })
        .catch(err => console.log(err));
      }
  }

  async getBlog(id) {
    const response = await fetch(`/api/blog/${id}`);
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  getTitleValidationState() {
    const length = this.state.title.length;
    let returnVal = null;

    if (length > 32) {
      returnVal = 'error';
    } else if (length > 0) {
      returnVal = 'success';
    }
    // TOOD: How does this handle 0 characters?
    return returnVal;
  }

  getDescValidationState() {
    const length = this.state.description.length;
    let returnVal = null;

    if (length > 128) {
      returnVal = 'error';
    } else if (length > 0) {
      returnVal = 'success';
    }
    // TOOD: How does this handle 0 characters?
    return returnVal;
  }

  getBodyValidationState() {
    const length = this.state.body.length;
    let returnVal = null;

    if (length > 512) {
      returnVal = 'error';
    } else if (length > 0) {
      returnVal = 'success';
    }
    // TOOD: How does this handle 0 characters?
    return returnVal;
  }

  handleTitleChange(e) {
    const title = e.target.value;
    const helpText = `${title.length}/32 characters`
    this.setState({ title: title, titleHelpText: helpText });
  }

  handleDescChange(e) {
    const desc = e.target.value;
    const helpText = `${desc.length}/128 characters`
    this.setState({ description: desc, descriptionHelpText: helpText });
  }

  handleBodyChange(e) {
    const body = e.target.value;
    const helpText = `${body.length}/512 characters`
    this.setState({ body: body, bodyHelpText: helpText });
  }

  async handleSubmit(e) {
    const valid = this.state.title.length <= 32
    && this.state.description.length <= 128
    && this.state.body.length <= 512;

    if (!valid){
      return;
    }

    // These should probably be sanatized to prevent sql injection
    const params = {
      "title": this.state.title,
      "description": this.state.description,
      "body": this.state.body,
      "userId": this.props.userId,
    };

    await this.callApi(params);
    this.setState({ redirect: true });
  }

  async callApi(params) {
    const id = this.state.id;
    const url = id ? `/api/blog/${id}` : "/api/blog"
    const method = id ? "PUT" : "POST";

    const postParams = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: method,
      body: JSON.stringify(params)
    };

    const response = await fetch(url, postParams);

    if (response.status !== 200) {
      alert("There was an error. Please try again.");
      return false;
    }

    return response;
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to="/blog" />;
    }
    return (
      <form className="blogForm">
        <FormGroup
          controlId="blogTitle"
          validationState={this.getTitleValidationState()}
        >
          {/* <ControlLabel>Blog title:</ControlLabel> */}
          <FormControl
            type="text"
            value={this.state.title}
            placeholder="Title                                                 (0/32)"
            className = "blogTitleClass"
            onChange={this.handleTitleChange}
          />
          <FormControl.Feedback />
          {/* s */}
        </FormGroup>

        <FormGroup
          controlId="blogDesc"
          validationState={this.getDescValidationState()}
        >
          {/* <ControlLabel>Short description of your blog:</ControlLabel> */}
          <FormControl
            type="text"
            value={this.state.description}
            placeholder="Short description of your blog...                                     (0/128)"
            className="blogDescClass"
            onChange={this.handleDescChange}
          />
          <FormControl.Feedback />
          {/* <HelpBlock>{this.state.descriptionHelpText}</HelpBlock> */}
        </FormGroup>

        <FormGroup
          controlId="blodBody"
          validationState={this.getBodyValidationState()}
        >
          {/* <ControlLabel>Post:</ControlLabel> */}
          <FormControl
            componentClass="textarea"
            value={this.state.body}
            placeholder="Tell your story...                                                                                              (0/512)"
            className="blogBodyClass"
            onChange={this.handleBodyChange}
          />
          <FormControl.Feedback />
          {/* <HelpBlock>{this.state.bodyHelpText}</HelpBlock> */}
        </FormGroup>

        <Button
          bsStyle="primary"
          onClick={this.handleSubmit}
          >
          Post
        </Button>
        <Link to="/blog">
          <Button>Cancel</Button>
        </Link>
      </form>
    );
  }
}

export default BlogForm;
