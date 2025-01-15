import React, { useEffect, useState } from 'react';
import { Note } from './types';
import { getNotes, createNote, updateNote, deleteNote } from './services/noteService';
import './App.css'

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (err) {
      console.error('Error fetching notes:', err);
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingNote) {
        // Update existing
        const updated = await updateNote(editingNote.id!, { title, content });
        setNotes(
          notes.map((note) => (note.id === editingNote.id ? updated : note))
        );
        setEditingNote(null);
      } else {
        // Create new
        const newNote = await createNote({ title, content });
        setNotes([newNote, ...notes]);
      }
      // Reset form
      setTitle('');
      setContent('');
    } catch (err) {
      console.error('Error creating/updating note:', err);
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNote(id);
      setNotes(notes.filter((note) => note.id !== id));
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  return (
    <div style={{ margin: 'auto', maxWidth: 600, padding: 20}}>
      <h1>My Notes</h1>

      <form onSubmit={handleCreateOrUpdate} style={{ marginBottom: 20 }}>
        <div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            rows={4}
          />
        </div>
        <button type="submit" style={{ marginTop: 10 }}>
          {editingNote ? 'Update Note' : 'Create Note'}
        </button>
      </form>

      <hr />

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {notes.map((note) => (
          <li key={note.id} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
            <small>Created: {new Date(note.created_at ?? '').toLocaleString()}</small><br />
            <small>Updated: {new Date(note.updated_at ?? '').toLocaleString()}</small>
            <div style={{ marginTop: 10 }}>
              <button onClick={() => handleEdit(note)} style={{ marginRight: 10 }}>Edit</button>
              <button onClick={() => handleDelete(note.id!)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;