import React, { Component } from "react";
import {
  Button,
  FormControl,
  ControlLabel,
  HelpBlock,
  FormGroup,
  Jumbotron,
} from "react-bootstrap";

import "./LoginForm.css";

class LoginForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleLoggedIn = this.props.callback;

    this.handleUserNameChange = this.handleUserNameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleCreate = this.handleCreate.bind(this);

    this.state = {
      userName: this.props.userName || "",
      password: this.props.password || "",
      loggedIn: !!this.props.userId,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!!nextProps.userId !== this.state.loggedIn) {
      this.setState({ loggedIn: !!nextProps.userId });
    }
  }

  getValidationState(field) {
    if(this.state[field] && this.state[field].length > 0){
      return "success";
    }
    return "error";
  }

  handleUserNameChange(e) {
    const userName = e.target.value;
    this.setState({ userName });
  }

  handlePasswordChange(e) {
    const password = e.target.value;
    this.setState({ password });
  }

  // This is a huge security issue because we actually send back the password
  // as plain text if the user gets the user name right but the password wrong.
  // We could get around this by hashing it or something before sending it. Is that
  // Really secure though? Probably not for this system but better than plain text passwords.
  async handleLogin() {
    const sanitizedUsername =  escape(this.state.userName);
    const response = await fetch(`/api/user/${sanitizedUsername}`);
    const body = await response.json();

    // Have to check against escaped because we store escaped values
    // in the database.
    const loginCorrect =
      body.username === escape(this.state.userName)
      && body.password === escape(this.state.password);

    if(!loginCorrect){
      alert("Either your username/password was wrong or the account doesn't exist.\nPlease try again.");
      return false;
    }

    this.handleLoggedIn(body._id, body.username);
  }

  async handleCreate() {
    const params = {
      username: escape(this.state.userName),
      password: escape(this.state.password),
    }

    const requestParams = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(params)
    };

    const response = await fetch("/api/user", requestParams);
    const body = await response.json();

    if (response.status !== 200 || !!body.error) {
      alert("There was an error. Please try again.");
      return false;
    }

    this.handleLoggedIn(body._id, body.username);
  }

  loginForm() {
    return (
      <form>
        <FormGroup
          controlId="userName"
          bsClass="firstForm"
          validationState={this.getValidationState("userName")}
        >
          <ControlLabel>Username:</ControlLabel>
          <FormControl
            type="text"
            value={this.state.userName}
            onChange={this.handleUserNameChange}
          />
          <FormControl.Feedback />
          <HelpBlock>Required</HelpBlock>
        </FormGroup>

        <FormGroup
          controlId="password"
          validationState={this.getValidationState("password")}
        >
          <ControlLabel>Password:</ControlLabel>
          <FormControl
            type="password"
            value={this.state.password}
            onChange={this.handlePasswordChange}
          />
          <FormControl.Feedback />
          <HelpBlock>Required</HelpBlock>
        </FormGroup>

        <FormGroup>
        <Button
          onClick={this.handleLogin}
          bsStyle="primary"
          >
          Login
        </Button>
        </FormGroup>
        <FormGroup>
        <Button
          onClick={this.handleCreate}
          bsStyle="primary"
          >
          Create account
        </Button>
        </FormGroup>
      </form>
    );
  }

  welcomeScreen() {
    return (
      <h2>Welcome to the blog {this.state.userName}!</h2>
    );
  }

  render() {
    return (
      <Jumbotron>
        {this.state.loggedIn ? this.welcomeScreen() : this.loginForm()}
      </Jumbotron>
    );
  }
}

export default LoginForm;
