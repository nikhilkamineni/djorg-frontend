import React, { Component } from 'react';
import axios from 'axios';

import AddNote from './components/add-note';
import Login from './components/login';
import Note from './components/note';

import './App.css';

/* STYLES */
const AppStyles = {
  background: '#222222',
  height: '100vh',
  width: '100%',
  margin: '0px',
  color: '#666666'
};

/* APP Component Start */
class App extends Component {
  state = {
    notes: [],
    noteTags: [],
    authenticated: false,
    user: {}
  };

  getUser = () => {
    let config = {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` }
    };

    axios // Get Notes from REST API
      .get('http://127.0.0.1:8000/api/users/', config)
      .then(res => this.setState({ user: res.data[0] }))
      .catch(err => console.log(`Error getting Notes: ${err}`));
  };

  getNotes = () => {
    this.setState({ authenticated: true });
    let config = {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` }
    };

    axios // Get Notes from REST API
      .get('http://127.0.0.1:8000/api/notes/', config)
      .then(res => this.setState({ notes: [...res.data] }))
      .catch(err => console.log(`Error getting Notes: ${err}`));

    axios // Get Tags from REST API
      .get('http://127.0.0.1:8000/api/notetags/')
      .then(res => this.setState({ noteTags: [...res.data] }))
      .catch(err => console.log(`Error getting Tags: ${err}`));
  };

  logoutHandler = () => {
    localStorage.removeItem('token');
    this.setState({ authenticated: false });
  };

  componentDidMount() {
    if (localStorage.getItem('token')) {
      this.getNotes();
      this.getUser();
    }
  }

  render() {
    return (
      <div className="App" style={AppStyles}>
        {this.state.authenticated ? (
          <div>
            Hello {this.state.user.username}<br />
            <a
              onClick={this.logoutHandler}
              style={{ color: 'maroon', cursor: 'pointer' }}
            >
              Sign Out
            </a>
          </div>
        ) : (
          <Login getNotes={this.getNotes} logoutHandler={this.logoutHandler} />
        )}

        {this.state.authenticated && (
          <div>
            <Note notes={this.state.notes} />
            <AddNote tags={this.state.noteTags} getNotes={this.getNotes} />
          </div>
        )}
      </div>
    ); //return ends
  } // render function ends
} // APP Component End

export default App;
