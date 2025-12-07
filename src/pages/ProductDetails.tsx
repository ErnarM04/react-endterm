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

// Lazy Image Component with IntersectionObserver
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

    useEffect(() => {
        if (!containerRef.current || isInView) return;

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
            {isInView && !hasError && (
                <img
                    src={src}
                    alt={alt}
                    className={className}
                    style={{
                        ...style,
                        display: isLoaded ? 'block' : 'none',
                        opacity: isLoaded ? 1 : 0,
                        transition: 'opacity 0.3s ease-in-out'
                    }}
                    onClick={onClick}
                    onLoad={handleLoad}
                    onError={handleError}
                    loading="lazy"
                />
            )}
            {hasError && (
                <div className="bg-light d-flex align-items-center justify-content-center" style={{ width: '100%', minHeight: '200px' }}>
                    <span className="text-muted">Failed to load image</span>
                </div>
            )}
        </div>
    );
}

// Image Gallery Component
const ImageGallery = React.memo(({ 
    images, 
    selectedImage, 
    onImageSelect 
}: { 
    images: string[]; 
    selectedImage: string | null; 
    onImageSelect: (src: string) => void;
}) => {
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
                        alt={`Thumbnail ${index}`}
                        className="thumbnail rounded"
                        onClick={() => onImageSelect(imgSrc)}
                        style={{
                            cursor: "pointer",
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            border: selectedImage === imgSrc ? "3px solid #007bff" : "grey solid 1px",
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
    const [addingToCart, setAddingToCart] = useState(false);
    const {selectedItem, loadingItem, errorItem} = useSelector((state: RootState) => state.items);
    const isFavorite = useSelector((state: RootState) => 
        selectedItem ? (state.favorites.favoriteStatuses[selectedItem.id] || false) : false
    );
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (id) {
            dispatch(fetchProductById(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (selectedItem) {
            const imagesArray = selectedItem.images.split(", ");
            setImage(imagesArray[0] || null);
        }
    }, [selectedItem])

    useEffect(() => {
        if (selectedItem) {
            dispatch(checkFavoriteStatus({ userId: user?.uid || null, productId: selectedItem.id }));
        }
    }, [selectedItem, user, dispatch]);

    const images = selectedItem ? selectedItem.images.split(", ") : [];

    if (loadingItem)
        return (
            <div className="d-flex mt-5 justify-content-center align-items-center">
                <Spinner />
            </div>
        );

    if (errorItem) return <ErrorBox message={errorItem} />;

    if (!selectedItem) return <ErrorBox message={"Product not found"} />;

    return (
        <div className="container mt-4">

            <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
                {"<- Back"}
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
                        <h2>{selectedItem.name}</h2>
                        <button
                            className={`btn ${isFavorite ? 'btn-danger' : 'btn-outline-danger'}`}
                            onClick={() => {
                                if (!selectedItem) return;
                                if (isFavorite) {
                                    dispatch(removeFavorite({ userId: user?.uid || null, productId: selectedItem.id }));
                                } else {
                                    dispatch(addFavorite({ userId: user?.uid || null, productId: selectedItem.id }));
                                }
                            }}
                            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                        >
                            {isFavorite ? '❤️' : '🤍'}
                        </button>
                    </div>
                    <h5 className="text-success">{selectedItem.price}$</h5>
                    <p>{selectedItem.description}</p>

                    <p><b>Category:</b> {selectedItem.category}</p>
                    <p><b>Brand:</b> {selectedItem.brand}</p>
                    <p><b>Stock:</b> {selectedItem.stock}</p>
                    <p><b>Rating:</b> {selectedItem.rating}</p>
                    
                    <div className="mt-4">
                        {cartError && <ErrorBox message={cartError} />}
                        <button
                            className="btn btn-primary btn-lg"
                            disabled={addingToCart || !user}
                            onClick={async () => {
                                if (!user) {
                                    navigate('/login');
                                    return;
                                }
                                try {
                                    setAddingToCart(true);
                                    await addItem(selectedItem.id, 1, selectedItem.name);
                                    // Notification is shown automatically by useCart hook
                                } catch (err) {
                                    console.error('Failed to add to cart:', err);
                                } finally {
                                    setAddingToCart(false);
                                }
                            }}
                        >
                            {!user 
                                ? 'Log in to Add to Cart' 
                                : addingToCart 
                                    ? 'Adding...' 
                                    : 'Add to Cart'
                            }
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );

}

