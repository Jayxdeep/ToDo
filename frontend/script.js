const BASE_URL = 'http://localhost:3000';

const addTodo = async () => {
    const input = document.getElementById('taskInput');
    if (!input) return;

    const task = input.value.trim();
    if (!task) {
        alert('Please enter a task');
        return;
    }

    const response = await fetch(`${BASE_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task }),
    });

    if (response.ok) {
        fetchTodos(); // Refresh list
        input.value = '';
    }
};

const completeTodo = async (id) => {
    const response = await fetch(`${BASE_URL}/todos/${id}`, {
        method: 'PUT',
    });

    if (response.ok) fetchTodos();
};

const deleteTodo = async (id) => {
    const response = await fetch(`${BASE_URL}/todos/${id}`, {
        method: 'DELETE',
    });

    if (response.ok) fetchTodos();
};

const displayTodo = (todo) => {
    const todoList = document.getElementById('todoList');

    const li = document.createElement('li');
    li.className = todo.completed ? 'completed' : '';

    li.innerHTML = `
        <span>${todo.task}</span>
        <div>
            <button class="complete-btn" onclick="completeTodo(${todo.id})">✔️</button>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">❌</button>
        </div>
    `;
    todoList.appendChild(li);
};
const fetchTodos = async () => {
    const response = await fetch(`${BASE_URL}/todos`);
    const todos = await response.json();

    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';

    todos.forEach(displayTodo);
};

// Load todos on startup
document.addEventListener('DOMContentLoaded', fetchTodos);