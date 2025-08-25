// frontend/src/App.js

import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import AddTodoForm from './components/AddTodoForm';
import SummaryModal from './components/SummaryModal'; // Import the new component
import { API_URL } from './config';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  useEffect(() => {
    console.log('Checking authentication...');
    fetch(`${API_URL}/api/current_user`, { credentials: 'include' })
      .then(res => {
        console.log('Auth response status:', res.status, res.ok);
        if (res.ok) {
          return res.json();
        } else {
          // If not authenticated, return null to show login page
          return null;
        }
      })
      .then(data => {
        console.log('Auth response data:', data);
        if (data) {
          setUser(data);
          console.log('User authenticated, fetching todos...');
          fetch(`${API_URL}/api/todos`, { credentials: 'include' })
            .then(res => res.json())
            .then(todosData => setTodos(todosData));
        } else {
          console.log('No user data, showing login page');
          setUser(null);
        }
      })
      .catch(error => {
        console.error('Authentication error:', error);
        setUser(null);
      });
  }, []);

  const handleAddTodo = (text) => {
    fetch(`${API_URL}/api/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      credentials: 'include',
    })
      .then(res => res.json())
      .then(newTodo => setTodos([...todos, newTodo]));
  };

  const handleDeleteTodo = (id) => {
    fetch(`${API_URL}/api/todos/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then(() => {
        setTodos(todos.filter(todo => todo._id !== id));
      });
  };

  const handleSummarize = () => {
    setIsLoadingSummary(true);
    fetch(`${API_URL}/api/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ todos }),
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setSummary(data.summary);
        setIsLoadingSummary(false);
      })
      .catch(() => setIsLoadingSummary(false));
  };

  const handleLogout = () => {
    fetch(`${API_URL}/api/logout`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(() => {
        setUser(null);
        setTodos([]);
        setSummary('');
      })
      .catch(error => {
        console.error('Logout error:', error);
        // Even if there's an error, clear the user state
        setUser(null);
        setTodos([]);
        setSummary('');
      });
  };

  const renderContent = () => {
    if (user === null) {
      return (
        <div className="login-container">
          <h1>Welcome to the Todo App</h1>
          <p>Please log in to manage your tasks.</p>
          <a href={`${API_URL}/auth/google`} className="login-button">
            Login with Google
          </a>
        </div>
      );
    }

    return (
      <>
        <header>
          <h1>{user.displayName}'s Todo List</h1>
          <div className="header-buttons">
            {todos.length > 0 && (
              <button onClick={handleSummarize} className="summarize-button">
                Summarize with AI
              </button>
            )}
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        </header>
        <AddTodoForm onAddTodo={handleAddTodo} />
        <TodoList todos={todos} onDeleteTodo={handleDeleteTodo} />
        <SummaryModal
          summary={summary}
          isLoading={isLoadingSummary}
          onClose={() => setSummary('')}
        />
      </>
    );
  };

  return <div className="App">{renderContent()}</div>;
}

export default App;