import React from 'react';

function Spinner({ size = 'lg', centered = true, text }) {
  const sizeClass = size === 'sm' ? 'spinner-border-sm' : '';
  
  const spinner = (
    <div className={centered ? 'd-flex flex-column align-items-center justify-content-center' : ''}>
      <div className={`spinner-border ${sizeClass} text-primary`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      {text && (
        <p className="mt-2 text-muted">{text}</p>
      )}
    </div>
  );

  if (centered) {
    return (
      <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
        {spinner}
      </div>
    );
  }

  return spinner;
}

export default Spinner;
