import React, { Component } from 'react';
import { Button, ButtonGroup, Panel } from "react-bootstrap";
import { Link } from 'react-router-dom'

import './BlogList.css';

class BlogList extends Component {
  emptyBlog = {
    title: "No blogs yet!",
    description: "Click the button above to write the first one!",
  };
  constructor(props, context) {
    super(props, context);

    this.handleDelete = this.handleDelete.bind(this);
    this.updateBlogList = this.updateBlogList.bind(this);

    this.state = {
      blogs: [
        this.emptyBlog,
      ],
    };
  }

  componentDidMount() {
    this.updateBlogList();
  }

  updateBlogList() {
    this.callApi()
      .then((res) => {
        if(res.length < 1) {
          res = [this.emptyBlog];
        }
        this.setState({ blogs: res });
      })
      .catch(err => console.log(err));
  }

  handleDelete(id) {
    this.callDeleteApi(id)
      .then((res) => {
        this.updateBlogList();
      })
      .catch(err => alert("There was an error deleting th blog"));
  }

  async callDeleteApi(id) {
    let deleteParams = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "DELETE",
    };
    const response = await fetch(`/api/blog/${id}`, deleteParams);

    if (response.status !== 200) throw Error(response.message);

    return true;
  };

  callApi = async () => {
    const response = await fetch('/api/blog');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  modifyBlogButtons(blog) {
    return (
      <React.Fragment>
        <Button bsStyle="danger">
        <Link to={`/blog/${blog._id}/edit`}>Update</Link>
        </Button>
        <Button
          bsStyle="danger"
          onClick={ () => this.handleDelete(blog._id)}
          >
          Delete
        </Button>
      </React.Fragment>
    );
  }

  render() {
    return (
      <div className="blogList">
        {!this.props.userId && (
          <Link to="/">
            <Button bsStyle="info" bsSize="large" block>
              Login
            </Button>
          </Link>
        )}

        {
          // This can be extracted into its own component
          this.state.blogs.map((blog, index) => {
            const buttonGroup = (blog._id) ? (
              <ButtonGroup>
                  <Button bsStyle="danger">
                    <Link to={`/blog/${blog._id}`}>
                      View
                    </Link>
                  </Button>
                {this.props.userId === blog.userId && this.modifyBlogButtons(blog)}
              </ButtonGroup>
            ) : ( <React.Fragment /> );
            return (
              <Panel key={index}>
                <Panel.Heading>
                  {blog.title}
                  {buttonGroup}
                </Panel.Heading>
                <Panel.Body>{blog.description}</Panel.Body>
              </Panel>
            );
          })
        }
        {!!this.props.userId && (
          <Link to="/blog/new">
            <Button bsStyle="default"  bsSize="large" block>
              New Post
            </Button>
          </Link>
        )}
      </div>
    );
  }
}

export default BlogList;
