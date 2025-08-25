import React from 'react';
import TodoItem from './TodoItem';

function TodoList({ todos, onDeleteTodo }) {
  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TodoItem key={todo._id} todo={todo} onDeleteTodo={onDeleteTodo} />
      ))}
    </ul>
  );
}

export default TodoList;