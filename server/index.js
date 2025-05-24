import express from 'express';
import cors from 'cors';

const notes = [
    {id: 1, title: 'Note1', created: new Date(Date.now()).toLocaleString(), description: 'Note 1 description', status: 'active'},
    {id: 2, title: 'Note2', created: new Date(Date.now()).toLocaleString(), description: 'Note 2 description', status: 'completed'},
    {id: 3, title: 'Note3', created: new Date(Date.now()).toLocaleString(), description: 'Note 3 description', status: 'active'},
]


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json())

let currentId = 4;

// Create a new note
app.post('/api/notes', (req, res) => {
    const { title, description, status } = req.body;
    const created = new Date(Date.now()).toLocaleString();
    const newNote = { id: currentId++, created,  title, description, status };
    notes.push(newNote);
    res.status(201).json(newNote);
});

// Get all notes
app.get('/api/notes', (req, res) => {
    res.json(notes);
});

// Get note by ID
app.get('/api/notes/:id', (req, res) => {
    const note = notes.find(n => n.id === parseInt(req.params.id));
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
});

// Update a note
app.put('/api/notes/:id', (req, res) => {
    const { title, description, status } = req.body;
    const noteIndex = notes.findIndex(n => n.id === parseInt(req.params.id));
    if (noteIndex < 0) return res.status(404).json({ message: 'Note not found' });
    const updatedNote = notes[noteIndex];
    updatedNote.title = title;
    updatedNote.status = status;
    updatedNote.description = description;
    updatedNote.created = new Date(Date.now()).toLocaleString();
    notes.splice(noteIndex, 1, updatedNote);
    res.json(updatedNote);
});

// Delete a note
app.delete('/api/notes/:id', (req, res) => {
    const noteIndex = notes.findIndex(n => n.id === parseInt(req.params.id));
    if (noteIndex === -1) return res.status(404).json({ message: 'Note not found' });
    const deletedNote = notes.splice(noteIndex, 1);
    res.json(deletedNote[0]);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});