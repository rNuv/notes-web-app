import React, { useEffect, useState } from 'react';
import { Note } from './types';
import { getNotes, createNote, updateNote, deleteNote } from './services/noteService';
import './App.css';

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Fetch notes on component mount
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
        // Update existing note
        const updated = await updateNote(editingNote.id!, { title, content });
        setNotes((prev) => prev.map((n) => (n.id === editingNote.id ? updated : n)));
        setEditingNote(null);
      } else {
        // Create new note
        const newNote = await createNote({ title, content });
        setNotes((prev) => [newNote, ...prev]);
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
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  return (
    <div className="App">
      <h1>Notes App</h1>
      <h2>ECE 458 Micro-project</h2>

      <div className="noteForm">
        <h2>{editingNote ? 'Edit Note' : 'Create a Note'}</h2>
        <form onSubmit={handleCreateOrUpdate}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Content (optional)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
          />
          <button type="submit">{editingNote ? 'Update Note' : 'Create Note'}</button>
        </form>
      </div>

      <div className="noteList">
        {notes.map((note) => (
          <div key={note.id} className="noteCard">
            <h2>{note.title}</h2>
            <p>{note.content}</p>
            <small>
              Created: {new Date(note.created_at ?? '').toLocaleString()} <br />
              Updated: {new Date(note.updated_at ?? '').toLocaleString()}
            </small>
            <div className="noteActions">
              <button onClick={() => handleEdit(note)}>Edit</button>
              <button className="deleteBtn" onClick={() => handleDelete(note.id!)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;