import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import Spinner from '../components/Spinner';

function Profile() {
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();
  const [signingOut, setSigningOut] = React.useState(false);

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/login');
    }
  }, [currentUser, loading, navigate]);

  const handleLogout = async () => {
    try {
      setSigningOut(true);
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setSigningOut(false);
    }
  };

  if (loading) {
    return <Spinner text="Loading..." />;
  }

  if (!currentUser) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col">
          <h1 className="mb-4">My Profile</h1>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="mb-4">User Information</h3>
              
              <div className="mb-3">
                <label className="form-label fw-bold">Email:</label>
                <p className="form-control-plaintext">{currentUser.email}</p>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">User ID:</label>
                <p className="form-control-plaintext text-muted small">{currentUser.uid}</p>
              </div>

              {currentUser.displayName && (
                <div className="mb-3">
                  <label className="form-label fw-bold">Display Name:</label>
                  <p className="form-control-plaintext">{currentUser.displayName}</p>
                </div>
              )}

              <div className="mb-3">
                <label className="form-label fw-bold">Email Verified:</label>
                <p className="form-control-plaintext">
                  {currentUser.emailVerified ? (
                    <span className="badge bg-success">Verified</span>
                  ) : (
                    <span className="badge bg-warning">Not Verified</span>
                  )}
                </p>
              </div>

              <div className="d-grid mt-4">
                <button
                  className="btn btn-danger"
                  onClick={handleLogout}
                  disabled={signingOut}
                >
                  {signingOut ? 'Signing out...' : 'Logout'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
