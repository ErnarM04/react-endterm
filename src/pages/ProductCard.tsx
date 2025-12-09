import React, { useEffect, useState, useRef } from 'react';
import './ProductCard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from "react-router";
import { useAuth } from "../services/AuthContext";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../services/store';
import { addFavorite, removeFavorite, checkFavoriteStatus } from '../features/favorites/favoritesSlice';
import { ImageSkeleton } from '../components/Spinner';
import { useTranslation } from "react-i18next";

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    thumbnail: string;
}

interface ProductCardProps {
    product: Product;
}

function ProductCard({ product }: ProductCardProps) {
    const { user } = useAuth();
    const dispatch = useDispatch<AppDispatch>();
    const isFavorite = useSelector((state: RootState) => state.favorites.favoriteStatuses[product.id] || false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);
    const { t } = useTranslation();

    useEffect(() => {
        dispatch(checkFavoriteStatus({ userId: user?.uid || null, productId: product.id }));
    }, [product.id, user, dispatch]);

    useEffect(() => {
        if (!imgRef.current || isInView) return;

        // Check if element is already in view
        const rect = imgRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight + 50 && rect.bottom > -50;
        
        if (isVisible) {
            setIsInView(true);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        if (observer) {
                            observer.disconnect();
                        }
                    }
                });
            },
            { rootMargin: '50px' }
        );

        observer.observe(imgRef.current);

        return () => {
            if (observer) {
                observer.disconnect();
            }
        };
    }, [isInView]);

    const handleFavoriteToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isFavorite) {
            dispatch(removeFavorite({ userId: user?.uid || null, productId: product.id }));
        } else {
            dispatch(addFavorite({ userId: user?.uid || null, productId: product.id }));
        }
    };

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = () => {
        setHasError(true);
        setIsLoaded(true);
    };

    return (
        <div className='card position-relative'>
            <button
                className="btn btn-sm position-absolute"
                style={{ top: '10px', right: '10px', zIndex: 10, backgroundColor: 'rgba(255,255,255,0.8)' }}
                onClick={handleFavoriteToggle}
                title={isFavorite ? t('products.removeFavorite') : t('products.addFavorite')}
            >
                {isFavorite ? '❤️' : '🤍'}
            </button>
            <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div ref={imgRef} style={{ position: 'relative', minHeight: '200px', overflow: 'hidden' }}>
                    {!isLoaded && !hasError && (
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '200px', zIndex: 1 }}>
                            <ImageSkeleton width="100%" height="200px" />
                        </div>
                    )}
                    {isInView && !hasError && (
                        <img 
                            className="card-img-top" 
                            src={product.thumbnail} 
                            alt={product.name}
                            onLoad={handleLoad}
                            onError={handleError}
                            style={{
                                position: 'relative',
                                width: '100%',
                                height: 'auto',
                                opacity: isLoaded ? 1 : 0,
                                transition: 'opacity 0.3s ease-in-out',
                                zIndex: 2,
                                display: 'block'
                            }}
                        />
                    )}
                    {!isInView && !hasError && (
                        <div style={{ width: '100%', height: '200px' }} />
                    )}
                    {hasError && (
                        <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: '200px', position: 'relative', zIndex: 2 }}>
                            <span className="text-muted small">{t('products.failedImage')}</span>
                        </div>
                    )}
                </div>
                <div className="card-body">
                    <h3 className='fw-bold' >{product.name}</h3>
                    <h5>{product.price}$</h5>
                    <p className='text'>
                        {product.description}
                    </p>
                </div>
            </Link>
        </div>
    );
}


export default ProductCard;



