import React from 'react';

function TodoItem({ todo, onDeleteTodo }) {
  return (
    <li>
      <span className="todo-text">{todo.text}</span>
      <button 
        onClick={() => onDeleteTodo(todo._id)}
        className="delete-button"
      >
        Delete
      </button> 
    </li>
  );
}

export default TodoItem;