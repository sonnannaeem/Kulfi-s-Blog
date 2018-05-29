import React, { Component } from 'react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { NavLink } from "react-router-dom";

class NavBar extends Component {
  render() {
    return (
      <React.Fragment>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <NavLink exact to="/">KULFI'S CORNER</NavLink>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav pullRight>
            {/* The wrapping in the <li> is a huge hack for styling, the errors don't really matter though. */}
            <li role="presentation">
              <NavLink exact to="/">
                Home
              </NavLink>
            </li>
            <li role="presentation">
              <NavLink exact to="/blog">
                Blog posts
              </NavLink>
            </li>
            {
              !!this.props.userName &&
              <NavItem href="/">
              Logout
              </NavItem>
            }
          </Nav>
          </Navbar>
      </React.Fragment>
    );
  }
}

export default NavBar;
