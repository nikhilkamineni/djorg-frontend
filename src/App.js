import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import ApolloClient from 'apollo-boost'
import gql from 'graphql-tag'

const client = new ApolloClient({
  // uri: "https://w5xlvm3vzz.lp.gql.zone/graphql"
  uri: "http://127.0.0.1:8000/graphql/"
})

const AppStyles = {
  'background': '#999999'
}

const noteListStyles = {
  'display': 'flex',
  'listStyleType': 'none'
}

const noteStyles = {
  'border': '1px solid black',
  'margin': '3px',
  'padding': '5px',
  'width': '15%'
}

class App extends Component {
  state = {
    notesREST: [],
    notesGRAPHQL: []
  };

  componentDidMount() {
    axios
      .get('http://127.0.0.1:8000/api/notes/')
      .then(res => this.setState({ notesREST: [...res.data] }))
      .catch(err => {
        console.log(err);
      });

    client.query({
      query: gql`
        {
          notes {
            title
            content
            user {
              username
              email
            }
          }
        }
      `
    })
    .then(res => this.setState({ notesGRAPHQL: [...res.data.notes] }))
    .then(res => console.log(this.state))
    .catch(err => console.log(err))
  }

  render() {
    return (
      <div className="App" style={AppStyles}>
        <h2>This is coming from the REST API</h2>
        <ul style={noteListStyles}>
          {this.state.notesREST.map((note, i) => {
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
    );
  }
}

export default App;
