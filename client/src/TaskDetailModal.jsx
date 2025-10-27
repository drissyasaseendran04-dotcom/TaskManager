import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';

const TaskDetailModal = ({ detail, closeDetail, toggleComplete, removeTask, updateTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: detail.title,
    description: detail.description || '',
    dueDate: detail.dueDate ? detail.dueDate.split('T')[0] : '',
  });

  const handleUpdate = async () => {
    await updateTask(detail.id, {
      ...editForm,
      dueDate: editForm.dueDate ? new Date(editForm.dueDate).toISOString() : '',
    });
    setIsEditing(false);
    closeDetail();
  };

  return (
    <div className="modal">
      <div className="modal-body">
        {isEditing ? (
          <>
            <h3>Edit Task</h3>
            <input
              type="text"
              placeholder="Title"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            />
            <textarea
              placeholder="Description"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            />
            <input
              type="date"
              value={editForm.dueDate}
              onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
            />
            <div className="modal-actions">
              <button onClick={handleUpdate}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <h3>{detail.title}</h3>
            <p>{detail.description || <em>No description</em>}</p>
            <p>
              <strong>Due:</strong>{' '}
              {detail.dueDate
                ? format(parseISO(detail.dueDate), 'yyyy-MM-dd')
                : 'No due date'}
            </p>
            <p>
              <strong>Created:</strong>{' '}
              {detail.createdAt
                ? format(parseISO(detail.createdAt), 'yyyy-MM-dd HH:mm')
                : '—'}
            </p>
            <p>
              <strong>Completed:</strong> {detail.completed ? 'Yes' : 'No'}
            </p>

            <div className="modal-actions">
              <button onClick={closeDetail}>Close</button>
              <button
                onClick={() => {
                  toggleComplete(detail.id);
                  closeDetail();
                }}
              >
                Toggle Complete
              </button>
              <button
                onClick={() => {
                  removeTask(detail.id);
                  closeDetail();
                }}
              >
                Delete
              </button>
              <button onClick={() => setIsEditing(true)}>Edit</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskDetailModal;
