require('dotenv').config(); // Load .env file

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path'); // Import path module

const app = express();
const port = process.env.PORT || 3000; // Load from .env

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// ✅ Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// ✅ Temporary in-memory storage (acting as a "fake database")
const todos = [];

// ✅ GET - Fetch all todos
app.get('/todos', (req, res) => {
    res.json(todos);
});

// ✅ POST - Add a new todo
app.post('/todos', (req, res) => {
    const { task } = req.body;
    if (!task) return res.status(400).json({ error: 'Task is required' });

    const newTodo = {
        id: todos.length + 1,
        task,
        completed: false
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

// ✅ PUT - Mark a todo as complete
app.put('/todos/:id', (req, res) => {
    const { id } = req.params;
    const todo = todos.find(t => t.id === parseInt(id));
    if (!todo) return res.status(404).json({ error: 'Todo not found' });

    todo.completed = true;
    res.json(todo);
});

// ✅ DELETE - Remove a todo
app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;
    const index = todos.findIndex(t => t.id === parseInt(id));
    if (index === -1) return res.status(404).json({ error: 'Todo not found' });

    todos.splice(index, 1);
    res.json({ success: true });
});

// ✅ Start Server (Accessible to all network devices)
app.listen(port, '0.0.0.0', () => {
    console.log(`✅ Backend listening on http://0.0.0.0:${port}`);
});
