import React from 'react';
import axios from 'axios';

// eslint-disable-next-line
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';

const API_URL = process.env.REACT_APP_API_URL;

const loginStyles = {
  width: '200px',
  display: 'block',
  margin: 'auto auto',
  paddingTop: '100px'
};



/* LOGIN COMPONENT */
const Login = props => {
  // Login Handler
  function loginHandler(event) {
    event.preventDefault();
    let creds = {
      username: event.target.username.value,
      password: event.target.password.value
    };

    axios
      .post(`${API_URL}api-token-auth/`, creds)
      .then(res => {
        localStorage.setItem('token', res.data.token); //eslint-disable-line
        props.getNotes();
      })
      .catch(err => {
        console.error(err); //eslint-disable-line
      });
  }

  return (
    <div style={loginStyles}>
      <Form onSubmit={loginHandler}>
        <FormGroup>
          <Label for="usernameInput">Username</Label>
          <Input name="username" id="usernameInput" />
        </FormGroup>
        <FormGroup>
          <Label for="passwordInput">Password</Label>
          <Input type="password" name="password" id="passwordInput" />
        </FormGroup>
        <Button type="submit" value="Submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default Login;
