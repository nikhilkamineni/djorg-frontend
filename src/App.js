import React, { Component } from 'react';
import './App.css';
import axios from 'axios';


/* STYLES */
const AppStyles = {
  background: '#999999',
  height: '100vh',
  width: '100%',
  margin: '0px'
};

const noteListStyles = {
  display: 'flex',
  listStyleType: 'none'
};

const noteStyles = {
  background: '#888888',
  border: '1px solid black',
  margin: '3px',
  padding: '5px',
  width: '15%'
};


/* LOGIN Component */
const Login = props => {
  const loginHandler = event => {
    event.preventDefault();
    let creds = {
      username: event.target.username.value,
      password: event.target.password.value
    };

    axios
      .post('http://127.0.0.1:8000/api-token-auth/', creds)
      .then(res => {
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


/* ADDNOTE Component Start */
const AddNote = props => {
  const saveNoteHandler = event => {
    event.preventDefault();

    let url = 'http://127.0.0.1:8000/api/notes/';

    let newNote = {
      title: event.target.title.value,
      content: event.target.content.value
      // tags: event.target.tags.value.split(',')
    };

    let config = {
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`,
      }
    };
    console.log(url, newNote, config)

    axios
      .post(url, newNote, config)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  };

  return (
    <form
      action=""
      style={{ display: 'flex', flexDirection: 'column', width: '200px' }}
      onSubmit={saveNoteHandler}
    >
      <fieldset>
        Title: <br />
        <input type="text" name="title" />
        Content: <br />
        <input type="text" name="content" />
        { /*
          Tags: <br />
          <div style={{ fontSize: '0.6em' }}>
            (enter tags you want to include seperated by comma)
          </div>
          {props.tags.map(tag => (
            <mark
              style={{ background: tag.color, color: 'white', fontSize: '0.6em' }}
              key={tag.name}
            >
              {' ' + tag.name + ' '}
            </mark>
          ))}{' '}
          */}
        <br />
        {/*<input type="text" name="tags" />*/}
        <input
          type="submit"
          value="Save"
          style={{ width: '30%', alignSelf: 'center' }}
        />
      </fieldset>
    </form>
  );
}; // ADDNOTE Component End


/* APP Component Start */
class App extends Component {
  state = {
    notesREST: [],
    noteTags: [],
    authenticated: false,
    toggleGRAPHQL: false
  };

  loginHandler = () => {
    this.setState({ authenticated: true });
    let config = {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` }
    };

    axios    // Get Notes from REST API
      .get('http://127.0.0.1:8000/api/notes/', config)
      .then(res => this.setState({ notesREST: [...res.data] }))
      .catch(err => console.log(`Error getting Notes: ${err}`));
    
    // axios    // Get Tags from REST API
    //   .get('http://127.0.0.1:8000/api/notetags/')
    //   .then(res => this.setState({ noteTagsREST: [...res.data] }))
    //   .catch(err => console.log(`Error getting Tags: ${err}`));
  };

  logoutHandler = () => {
    localStorage.removeItem('token');
    this.setState({ authenticated: false });
  };

  componentDidMount() {
    if (localStorage.getItem('token')) this.loginHandler();
  }

  render() {
    return (
      <div className="App" style={AppStyles}>
        {this.state.authenticated ? (
          <a
            onClick={this.logoutHandler}
            style={{ color: 'maroon', cursor: 'pointer' }}
          >
            Sign Out
          </a>
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
                    { /* <h4>{note.user.username}</h4> */ }
                    { /* <h4>{note.user.email}</h4> */ }
                    <p>{note.content}</p>
                    { /*
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
                    */ }
                  </li>
                );
              })}
            </ul>

            { /* this.state.noteTagsREST.length > 0 && 
            (<AddNote tags={this.state.noteTagsREST} />) 
            */ }
            <AddNote tags={this.state.noteTags}/>
          </div>
        )}
      </div>
    ); //return ends
  } // render function ends
} // APP Component End

export default App;
