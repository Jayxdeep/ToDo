require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const todos = [];

app.get('/todos', (req, res) => {
    res.json(
        todos.map(todo => ({
            id: todo.id,
            task: todo.task,
            status: todo.completed ? '✔️' : '❌' 
        }))
    );
});

app.post('/todos', (req, res) => {
    const tasks = Array.isArray(req.body) ? req.body : [req.body]; // Handle both single and array input

    if (tasks.length === 0) {
        return res.status(400).json({ error: 'Tasks should not be an empty array' });
    }

    const newTodos = [];

    tasks.forEach(taskObj => {
        if (!taskObj.task) {
            return res.status(400).json({ error: 'Task is required' });
        }

        const newTodo = {
            id: todos.length + 1,
            task: taskObj.task,
            completed: false
        };
        todos.push(newTodo);
        newTodos.push(newTodo);
    });

    res.status(201).json(newTodos);
});

app.put('/todos/:id', (req, res) => {
    const { id } = req.params;
    const todo = todos.find(t => t.id === parseInt(id));
    if (!todo) return res.status(404).json({ error: 'Todo not found' });

    todo.completed = true;
    res.json({ 
        id: todo.id, 
        task: todo.task, 
        status: '✔️' 
    });
});


app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;
    const index = todos.findIndex(t => t.id === parseInt(id));
    if (index === -1) return res.status(404).json({ error: 'Todo not found' });

    todos.splice(index, 1);
    res.json({ success: true });
});


app.listen(port, '0.0.0.0', () => {
    console.log(`✅ Backend listening on http://0.0.0.0:${port}`);
});