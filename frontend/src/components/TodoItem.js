import React from 'react';

function TodoItem({ todo, onDeleteTodo }) {
  return (
    <li>
      {todo.text}
      <button onClick={() => onDeleteTodo(todo.id)}>Delete</button>
    </li>
  );
}

export default TodoItem;