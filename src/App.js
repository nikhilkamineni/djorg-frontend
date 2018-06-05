import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';

const client = new ApolloClient({
  uri: 'http://127.0.0.1:8000/graphql/'
});

const AppStyles = {
  background: '#999999'
};

const noteListStyles = {
  display: 'flex',
  listStyleType: 'none'
};

const noteStyles = {
  border: '1px solid black',
  margin: '3px',
  padding: '5px',
  width: '15%'
};

const Login = props => {
  const loginHandler = event => {
    event.preventDefault();
    let creds = {
      username: event.target.username.value,
      password: event.target.password.value
    };

    console.log(creds);

    axios
      .post('http://127.0.0.1:8000/api-token-auth/', creds)
      .then(res => {
        console.log(res.data.token);
        localStorage.setItem('token', res.data.token);
        props.loginHandler();
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <form onSubmit={loginHandler}>
      Username: <input type="text" name="username" /> <br />
      Password: <input type="password" name="password" /> <br />
      <input type="submit" value="Login" />
    </form>
  );
};

class App extends Component {
  state = {
    notesREST: [],
    notesGRAPHQL: [],
    authenticated: false,
    toggleGRAPHQL: false
  };

  loginHandler = () => {
    this.setState({ authenticated: true });
    console.log(this.state);
    let config = {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` }
    };
    axios
      .get('http://127.0.0.1:8000/api/notes/', config)
      .then(res => this.setState({ notesREST: [...res.data] }))
      .catch(err => {
        console.log(err);
      });
  };

  logoutHandler = () => {
    localStorage.removeItem('token');
    this.setState({ authenticated: false });
  };

  componentDidMount() {
    // if (this.state.authenticated) {
    //   let config = {
    //     headers: { Authorization: `Token ${localStorage.getItem('token')}` }
    //   };
    //   axios
    //     .get('http://127.0.0.1:8000/api/notes/', config)
    //     .then(res => this.setState({ notesREST: [...res.data] }))
    //     .catch(err => {
    //       console.log(err);
    //     });
    // }

    // axios
    //   .get('http://127.0.0.1:8000/api/notes/')
    //   .then(res => this.setState({ notesREST: [...res.data] }))
    //   .catch(err => {
    //     console.log(err);
    //   });

    client
      .query({
        query: gql`
          {
            notes {
              title
              content
              user {
                username
                email
              }
              tags {
                name
                color
              }
            }
          }
        `
      })
      .then(res => this.setState({ notesGRAPHQL: [...res.data.notes] }))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="App" style={AppStyles}>
        {this.state.authenticated ? (
          <h3 onClick={this.logoutHandler}>Sign Out</h3>
        ) : (
          <Login
            loginHandler={this.loginHandler}
            logoutHandler={this.logoutHandler}
          />
        )}

        {this.state.authenticated && (
          <div>
            <h2>This is coming from the REST API</h2>
            <ul style={noteListStyles}>
              {this.state.notesREST.map((note, i) => {
                return (
                  <li key={i} style={noteStyles}>
                    <h3>{note.title}</h3>
                    <h4>{note.user.username}</h4>
                    <h4>{note.user.email}</h4>
                    <p>{note.content}</p>
                    <h5>
                      {note.tags.map((tag, i) => {
                        return (
                          <mark
                            key={i}
                            style={{
                              backgroundColor: tag.color,
                              color: 'white',
                              padding: '3px'
                            }}
                          >
                            {tag.name}
                          </mark>
                        );
                      })}
                    </h5>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {this.state.toggleGRAPHQL && (
          <div class="Notes-GRAPHQL">
            <h2>This is coming from the GRAPHQL API</h2>
            <ul style={noteListStyles}>
              {this.state.notesGRAPHQL.map((note, i) => {
                return (
                  <li key={i} style={noteStyles}>
                    <h3>{note.title}</h3>
                    <h4>{note.user.username}</h4>
                    <h4>{note.user.email}</h4>
                    <p>{note.content}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

export default App;
