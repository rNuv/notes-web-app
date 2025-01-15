import axios from 'axios';
import { Note } from '../types';

const API_URL = 'http://127.0.0.1:8000/api/notes';

export async function getNotes(): Promise<Note[]> {
  const response = await axios.get<Note[]>(`${API_URL}/`);
  return response.data;
}

export async function createNote(note: Partial<Note>): Promise<Note> {
  const response = await axios.post<Note>(`${API_URL}/`, note);
  return response.data;
}

export async function updateNote(id: number, note: Partial<Note>): Promise<Note> {
  const response = await axios.put<Note>(`${API_URL}/${id}/`, note);
  return response.data;
}

export async function deleteNote(id: number): Promise<void> {
  await axios.delete(`${API_URL}/${id}/`);
}