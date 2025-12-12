import React, { useEffect, useState, useRef, Suspense } from "react";
import { useParams, useNavigate } from "react-router";
import Spinner, { ImageSkeleton } from "../components/Spinner";
import ErrorBox from "../components/ErrorBox";
import {useDispatch, useSelector} from "react-redux";
import {fetchProductById} from "../features/items/itemsSlice";
import {RootState, AppDispatch} from "../services/store";
import { useAuth } from "../services/AuthContext";
import { addFavorite, removeFavorite, checkFavoriteStatus } from "../features/favorites/favoritesSlice";
import { useCart } from "../hooks/useCart";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

function LazyImage({ 
    src, 
    alt, 
    className = "", 
    style = {},
    onClick,
    onLoad
}: { 
    src: string; 
    alt: string; 
    className?: string; 
    style?: React.CSSProperties;
    onClick?: () => void;
    onLoad?: () => void;
}) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const [hasError, setHasError] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const { t } = useTranslation();

    useEffect(() => {
        if (!containerRef.current || isInView) return;

        const rect = containerRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight + 50 && rect.bottom > -50;
        
        if (isVisible) {
            setIsInView(true);
            return;
        }

        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        if (observerRef.current) {
                            observerRef.current.disconnect();
                        }
                    }
                });
            },
            { rootMargin: '50px' }
        );

        observerRef.current.observe(containerRef.current);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [isInView]);

    useEffect(() => {
        if (isInView && !isLoaded && !hasError && imgRef.current) {
            const timeout = setTimeout(() => {
                if (!isLoaded) {
                    setHasError(true);
                    setIsLoaded(true);
                }
            }, 10000);

            return () => clearTimeout(timeout);
        }
    }, [isInView, isLoaded, hasError]);

    const handleLoad = () => {
        setIsLoaded(true);
        if (onLoad) onLoad();
    };

    const handleError = () => {
        setHasError(true);
        setIsLoaded(true);
    };

    const containerStyle: React.CSSProperties = {
        position: 'relative',
        width: style.width || '100%',
        height: style.height || 'auto',
        ...(style.width && style.height ? {} : {})
    };

    return (
        <div ref={containerRef} style={containerStyle}>
            {!isLoaded && !hasError && (
                <ImageSkeleton 
                    width={typeof style.width === 'string' ? style.width : '100%'} 
                    height={typeof style.height === 'string' ? style.height : '200px'} 
                />
            )}
            {isInView && (
                <img
                    ref={imgRef}
                    src={src}
                    alt={alt}
                    className={className}
                    style={{
                        ...style,
                        position: isLoaded ? 'relative' : 'absolute',
                        top: isLoaded ? 'auto' : 0,
                        left: isLoaded ? 'auto' : 0,
                        width: '100%',
                        opacity: isLoaded ? 1 : 0,
                        transition: 'opacity 0.3s ease-in-out',
                        zIndex: isLoaded ? 1 : 0,
                        display: 'block'
                    }}
                    onClick={onClick}
                    onLoad={handleLoad}
                    onError={handleError}
                    loading="lazy"
                />
            )}
            {hasError && (
                <div className="bg-light d-flex align-items-center justify-content-center" style={{ width: '100%', minHeight: typeof style.height === 'string' ? style.height : '200px' }}>
                    <span className="text-muted">{t('products.failedImage')}</span>
                </div>
            )}
        </div>
    );
}

const ImageGallery = React.memo(({ 
    images, 
    selectedImage, 
    onImageSelect 
}: { 
    images: string[]; 
    selectedImage: string | null; 
    onImageSelect: (src: string) => void;
}) => {
    const { t } = useTranslation();
    return (
        <div>
            <LazyImage
                src={selectedImage || images[0] || ''}
                alt="Product"
                className="img-fluid rounded my-3 shadow-sm"
                style={{ width: "360px", height: "100%", objectFit: "contain" }}
            />
            <div className="d-flex gap-2 flex-wrap mt-3">
                {images.map((imgSrc: string, index: number) => (
                    <LazyImage
                        key={index}
                        src={imgSrc}
                        alt={t('products.thumbnails', { index })}
                        className="thumbnail rounded"
                        onClick={() => onImageSelect(imgSrc)}
                        style={{
                            cursor: "pointer",
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            border: selectedImage === imgSrc ? "3px solid #D5D8DC" : "grey solid 1px",
                        }}
                    />
                ))}
            </div>
        </div>
    );
});

export default function ItemDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addItem, error: cartError } = useCart();
    const [image, setImage] = useState<string | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const [addingToCart, setAddingToCart] = useState(false);
    const {selectedItem, loadingItem, errorItem} = useSelector((state: RootState) => state.items);
    const isFavorite = useSelector((state: RootState) => 
        selectedItem ? (state.favorites.favoriteStatuses[selectedItem.id] || false) : false
    );
    const dispatch = useDispatch<AppDispatch>();
    const { t } = useTranslation();
    const isRu = i18n.language?.startsWith("ru");
    const displayName = isRu && selectedItem?.name_ru ? selectedItem.name_ru : selectedItem?.name;
    const displayDescription = isRu && selectedItem?.description_ru ? selectedItem.description_ru : selectedItem?.description;
    const displayCategory = isRu && selectedItem?.category_ru ? selectedItem.category_ru : selectedItem?.category;

    useEffect(() => {
        if (id) {
            dispatch(fetchProductById(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (selectedItem) {
            setImage(selectedItem.images.split(", ")[0] || null);
        }
    }, [selectedItem])

    useEffect(() => {
        if (selectedItem) {
            dispatch(checkFavoriteStatus({ userId: user?.uid || null, productId: selectedItem.id }));
            setImages(selectedItem.images.split(", "));
        }
    }, [selectedItem, user, dispatch]);

    if (loadingItem)
        return (
            <div className="d-flex mt-5 justify-content-center align-items-center">
                <Spinner />
            </div>
        );

    if (errorItem) return <ErrorBox message={errorItem} />;

    if (!selectedItem) return <ErrorBox message={t('products.notFound')} />;

    return (
        <div className="container mt-4">

            <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
                {t('products.back')}
            </button>

            <div className="row">
                <div className="col-md-4 mb-4">
                    <Suspense fallback={<ImageSkeleton width="360px" height="400px" />}>
                        <ImageGallery
                            images={images}
                            selectedImage={image}
                            onImageSelect={setImage}
                        />
                    </Suspense>
                </div>

                <div className="col-md-6 mb-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                        <h2>{displayName}</h2>
                        <button
                            className={"btn favorite-button"}
                            onClick={() => {
                                if (!selectedItem) return;
                                if (isFavorite) {
                                    dispatch(removeFavorite({ userId: user?.uid || null, productId: selectedItem.id }));
                                } else {
                                    dispatch(addFavorite({ userId: user?.uid || null, productId: selectedItem.id }));
                                }
                            }}
                            title={isFavorite ? t('products.removeFavorite') : t('products.addFavorite')}
                        >
                            {isFavorite ? '❤️' : '🖤'}
                        </button>
                    </div>
                    <h5 className="text-success">{selectedItem.price}$</h5>
                    <p>{displayDescription}</p>
                    <p><b>{t('products.category')}:</b> {displayCategory}</p>
                    <p><b>{t('products.brand')}:</b> {selectedItem.brand}</p>
                    <p><b>{t('products.stock')}:</b> {selectedItem.stock}</p>
                    <p><b>{t('products.rating')}:</b> {selectedItem.rating}</p>
                    
                    <div className="mt-4">
                        {cartError && (
                            <div className="mb-3">
                                <ErrorBox message={cartError} />
                            </div>
                        )}
                        <button
                            className="btn btn-primary btn-lg"
                            style={{backgroundColor: "#5D8A6A", border: 0}}
                            disabled={addingToCart || !user}
                            onClick={async () => {
                                if (!user) {
                                    navigate('/login');
                                    return;
                                }
                                try {
                                    setAddingToCart(true);
                                    await addItem(selectedItem.id, 1, displayName);
                                } catch (err) {
                                    const errorMessage = err instanceof Error 
                                        ? err.message 
                                        : 'Failed to add item to cart. Please try again.';
                                    console.error('Failed to add to cart:', err);
                                } finally {
                                    setAddingToCart(false);
                                }
                            }}
                        >
                            {!user 
                                ? t('products.loginToAdd') 
                                : addingToCart 
                                    ? t('products.adding') 
                                    : t('products.addToCart')
                            }
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );

}

