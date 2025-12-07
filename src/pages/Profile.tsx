import React, { useEffect, useRef, useState } from 'react';
import {Navigate, useNavigate} from "react-router";
import {useAuth} from "../services/AuthContext";
import {signOut} from "firebase/auth";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../services/store';
import { fetchProfile, uploadProfilePicture, removeProfilePicture } from '../features/profile/profileSlice';
import { compressImage } from "../utils/imageCompression";
import ErrorBox from "../components/ErrorBox";
import Spinner from "../components/Spinner";
import NotificationPermission from "../components/NotificationPermission";

function Profile() {
    const { user, auth } = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { photoURL, loading, uploading, error } = useSelector((state: RootState) => state.profile);
    const [validationError, setValidationError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            dispatch(fetchProfile(user.uid));
        }
    }, [user, dispatch]);

    if (!user) {
        return <Navigate to="/login" replace/>
    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setValidationError(null);

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setValidationError('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setValidationError('Image size must be less than 5MB');
            return;
        }

        try {
            // Compress image
            const compressedBase64 = await compressImage(file, 400, 400, 0.8);

            // Save to Firestore via Redux
            dispatch(uploadProfilePicture({ userId: user.uid, photoBase64: compressedBase64 }));
        } catch (err) {
            console.error('Error compressing image:', err);
            setValidationError('Failed to process image. Please try again.');
        } finally {
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemovePicture = () => {
        if (user) {
            dispatch(removeProfilePicture(user.uid));
        }
    };

    function handleLogout() {
        signOut(auth).then(() => {
            navigate("/");
        }).catch((err) => {
            console.log(err);
        });
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '90vh' }}>
                <Spinner />
            </div>
        );
    }

    return (
        <div 
            className="d-flex align-items-center justify-content-center"
            style={{ width: "100%", minHeight: "90vh" }}
        >
            <div className="card shadow border-0 p-4" style={{ width: "100%", maxWidth: "500px" }}>
                <h3 className="card-title mb-4">Profile</h3>

                {(error || validationError) && <ErrorBox message={error || validationError || ''} />}

                {/* Profile Picture Section */}
                <div className="text-center mb-4">
                    <div className="position-relative d-inline-block">
                        {photoURL ? (
                            <img
                                src={photoURL}
                                alt="Profile"
                                className="rounded-circle"
                                style={{
                                    width: '150px',
                                    height: '150px',
                                    objectFit: 'cover',
                                    border: '3px solid #dee2e6',
                                }}
                            />
                        ) : (
                            <div
                                className="rounded-circle d-flex align-items-center justify-content-center bg-secondary text-white"
                                style={{
                                    width: '150px',
                                    height: '150px',
                                    fontSize: '4rem',
                                }}
                            >
                                {user.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                        )}
                        {uploading && (
                            <div
                                className="position-absolute top-0 start-0 w-100 h-100 rounded-circle d-flex align-items-center justify-content-center"
                                style={{
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                }}
                            >
                                <Spinner />
                            </div>
                        )}
                    </div>
                    <div className="mt-3">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                            id="profile-picture-input"
                        />
                        <label htmlFor="profile-picture-input" className="btn btn-primary btn-sm me-2">
                            {photoURL ? 'Change Photo' : 'Upload Photo'}
                        </label>
                        {photoURL && (
                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={handleRemovePicture}
                                disabled={uploading}
                            >
                                Remove Photo
                            </button>
                        )}
                    </div>
                </div>

                <div className="mb-3">
                    <h5 className="text-muted mb-1">Email</h5>
                    <div className="bg-light border-0 p-2 rounded">
                        {user.email}
                    </div>
                </div>

                <div className="mb-4">
                    <h5 className="text-muted mb-1">User ID</h5>
                    <div className="bg-light border-0 p-2 rounded">
                        {user.uid}
                    </div>
                </div>

                {/* Notification Permission Section */}
                <div className="mb-4">
                    <NotificationPermission />
                </div>

                <button 
                    onClick={handleLogout}
                    className="btn btn-danger m-auto w-50"
                    disabled={uploading}
                >
                    Log Out
                </button>
            </div>
        </div>
    );
}

export default Profile;
