import React from 'react';


const noteListStyles = {
  display: 'flex',
  listStyleType: 'none'
};

const noteStyles = {
  background: '#333333',
  border: '1px solid black',
  margin: '3px',
  padding: '15px',
  width: '15%'
};


const Note = props => {
  return (
    <div>
      <h2>Your Personal Notes</h2>
      <ul style={noteListStyles}>
        {props.notes.map((note, i) => {
          return (
            <li key={i} style={noteStyles}>
              <h3>{note.title}</h3>
              {/* <h4>{note.user.username}</h4> */}
              {/* <h4>{note.user.email}</h4> */}
              <p>{note.content}</p>
              {/*
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
                    */}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Note;
