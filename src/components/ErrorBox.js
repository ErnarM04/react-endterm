import React, { useState } from 'react';

function ErrorBox({ message, variant = 'danger', onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  if (!message || !isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className={`alert alert-${variant} alert-dismissible fade show mb-4`} role="alert">
      <h4 className="alert-heading">Error!</h4>
      <p>{message}</p>
      {onClose && (
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={handleClose}
        ></button>
      )}
    </div>
  );
}

export default ErrorBox;
