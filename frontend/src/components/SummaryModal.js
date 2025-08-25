// frontend/src/components/SummaryModal.js

import React from 'react';

function SummaryModal({ summary, onClose, isLoading }) {
  if (!summary && !isLoading) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>AI Summary</h2>
        {isLoading ? (
          <p>Generating summary...</p>
        ) : (
          <p>{summary}</p>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default SummaryModal;