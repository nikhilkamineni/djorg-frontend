import React from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL

const Login = props => {

  function loginHandler(event) {
    event.preventDefault();
    let creds = {
      username: event.target.username.value,
      password: event.target.password.value
    };

    axios
      .post(`${API_URL}api-token-auth/`, creds)
      .then(res => {
        localStorage.setItem('token', res.data.token);
        props.getNotes();
      })
      .catch(err => {
        console.log(err);
      });
  }

  return (
    <form onSubmit={loginHandler}>
      Username: <input type="text" name="username" /> <br />
      Password: <input type="password" name="password" /> <br />
      <input type="submit" value="Login" />
    </form>
  );
}; 

export default Login;
