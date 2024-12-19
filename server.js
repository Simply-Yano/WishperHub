const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
    .connect('mongodb://localhost:27017/wishperhub', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define Note Schema
const noteSchema = new mongoose.Schema({
    username: { type: String, required: true },
    content: { type: String, required: true },
    comments: [{ content: String, createdAt: { type: Date, default: Date.now } }],
    createdAt: { type: Date, default: Date.now },
});

const Note = mongoose.model('Note', noteSchema);

// Routes

// Get all notes
app.get('/notes', async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching notes', error: err });
    }
});

// Add a new note
app.post('/notes', async (req, res) => {
    const { username, content } = req.body;
    if (!username || !content) {
        return res.status(400).json({ message: 'Username and content are required' });
    }

    try {
        const newNote = new Note({ username, content });
        await newNote.save();
        res.status(201).json(newNote);
    } catch (err) {
        res.status(500).json({ message: 'Error saving note', error: err });
    }
});

// Add a comment to a note
app.post('/notes/:id/comments', async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ message: 'Comment content is required' });
    }

    try {
        const note = await Note.findById(id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        note.comments.push({ content });
        await note.save();
        res.status(201).json(note);
    } catch (err) {
        res.status(500).json({ message: 'Error adding comment', error: err });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
