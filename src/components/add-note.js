import React from 'react';
import axios from 'axios';

const FormStyles = {
  display: 'flex',
  flexDirection: 'column',
  width: '200px',
  backgroundColor: '#333333',
  padding: '10px',
  border: '1px solid black'
};

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
        Authorization: `Token ${localStorage.getItem('token')}`
      }
    };

    axios
      .post(url, newNote, config)
      .then(res => {
        console.log(res);
        props.getNotes();
      })
      .catch(err => console.log(err));
  };

  return (
    <form action="" style={FormStyles} onSubmit={saveNoteHandler}>
      <fieldset style={{ border: 'none' }}>
        Title: <br />
        <input type="text" name="title" />
        Content: <br />
        <input type="text" name="content" />
        {/*
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
};

export default AddNote;
