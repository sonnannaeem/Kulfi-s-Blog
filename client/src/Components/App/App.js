import React, { Component } from 'react';
import { HashRouter, Switch, Route } from "react-router-dom";

import LoginForm from "./../LoginForm/LoginForm";
import NavBar from "./../NavBar/NavBar";
import BlogList from "./../BlogList/BlogList"
import BlogPost from "./../BlogPost/BlogPost";
import BlogForm from "./../BlogForm/BlogForm";

class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleUserChange = this.handleUserChange.bind(this);

    this.state = {
      user: {
        id: null,
        name: "",
      },
    };
  }

  handleUserChange(id, name) {
    this.setState({
      user: {
        id,
        name,
      },
    });
  };

  loginForm() {
    return (
      <Route
        exact path="/"
        render={(props) => <LoginForm {...props} callback={this.handleUserChange} userId={this.state.user.id} userName={this.state.user.name} />}
        />
    );
  }

  blogList() {
    return (
      <Route
        exact path="/blog"
        render={(props) => <BlogList {...props} userId={this.state.user.id} />}
        />
    );
  }

  editBlogForm() {
    return (
      <Route
        exact path="/blog/:id/edit"
        render={(props) => <BlogForm {...props} userId={this.state.user.id} />}
        />
    );
  }

  newBlogForm() {
    return (
      <Route
        exact path="/blog/new"
        render={(props) => <BlogForm {...props} userId={this.state.user.id} />}
        />
    );
  }

  blogPost() {
    return (
      <Route
        exact path="/blog/:id"
        render={(props) => <BlogPost {...props} userId={this.state.user.id} userName={this.state.user.name} />}
        />
    );
  }

  render() {
    return(
      <HashRouter>
        <div>
          <NavBar userName={this.state.user.name} />
          <div>
            <Switch>
              {this.loginForm()}
              {this.blogList()}
              {this.editBlogForm()}
              {this.newBlogForm()}
              {this.blogPost()}
              {/* 404 route? */}
            </Switch>
          </div>
        </div>
      </HashRouter>
    );
  }
}

export default App;
