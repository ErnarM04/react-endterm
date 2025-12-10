import React, { useEffect, useRef, useState } from 'react';
import {Navigate, useNavigate} from "react-router";
import {useAuth} from "../services/AuthContext";
import {signOut} from "firebase/auth";
import { getUserProfile, saveProfilePicture } from "../services/profileService";
import { compressImage } from "../utils/imageCompression";
import ErrorBox from "../components/ErrorBox";
import Spinner from "../components/Spinner";
import NotificationPermission from "../components/NotificationPermission";
import { useTranslation } from "react-i18next";

function Profile() {
    const { user, auth } = useAuth();
    const navigate = useNavigate();
    const [photoURL, setPhotoURL] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { t } = useTranslation();

    useEffect(() => {
        if (user) {
            setLoading(true);
            getUserProfile(user.uid)
                .then((profile) => {
                    setPhotoURL(profile?.photoURL || null);
                    setError(null);
                })
                .catch((err) => {
                    setError(err.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [user]);

    if (!user) {
        return <Navigate to="/login" replace/>
    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setValidationError(null);

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setValidationError(t('profile.validation.imageType'));
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setValidationError(t('profile.validation.imageSize'));
            return;
        }

        try {
            // Compress image
            const compressedBase64 = await compressImage(file, 400, 400, 0.8);

            // Save to Firestore
            setUploading(true);
            await saveProfilePicture(user.uid, compressedBase64);
            setPhotoURL(compressedBase64);
            setError(null);
        } catch (err) {
            console.error('Error compressing image:', err);
            setValidationError(t('profile.validation.processFailed'));
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemovePicture = async () => {
        if (user) {
            try {
                setUploading(true);
                await saveProfilePicture(user.uid, '');
                setPhotoURL(null);
                setError(null);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setUploading(false);
            }
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
            <div className="card shadow border-0 p-4" style={{ width: "100%", maxWidth: "800px" }}>
                <h3 className="card-title mb-4">{t('profile.title')}</h3>

                {(error || validationError) && <ErrorBox message={error || validationError || ''} />}

                <div className="d-flex flex-column flex-md-row gap-4">
                    <div className="d-flex flex-column align-items-center">
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
                        <div className="mt-3 d-flex flex-column align-items-center">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                            id="profile-picture-input"
                        />
                            <label htmlFor="profile-picture-input" className="btn btn-primary btn-sm mb-2">
                            {photoURL ? t('profile.changePhoto') : t('profile.uploadPhoto')}
                        </label>
                        {photoURL && (
                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={handleRemovePicture}
                                disabled={uploading}
                            >
                                {t('profile.removePhoto')}
                            </button>
                        )}
                    </div>
                </div>

                    <div className="flex-grow-1">
                <div className="mb-3">
                    <h5 className="text-muted mb-1">{t('profile.email')}</h5>
                    <div className="bg-light border-0 p-2 rounded">
                        {user.email}
                    </div>
                </div>

                <div className="mb-4">
                    <h5 className="text-muted mb-1">{t('profile.userId')}</h5>
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
                            className="btn btn-danger"
                    disabled={uploading}
                >
                    {t('profile.logout')}
                </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
