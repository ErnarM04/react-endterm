import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import './ProductsList.css';
import LoadingSpinner from "../components/Spinner";
import { useSearchParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from '../hooks/useDebounce';
import { setQuery, setPage, fetchProductsByQuery } from "../features/items/itemsSlice";
import ErrorBox from "../components/ErrorBox";
import {RootState, AppDispatch} from "../services/store";
import { useTranslation } from "react-i18next";

function ProductsList() {
    const dispatch = useDispatch<AppDispatch>();
    const [searchParams, setSearchParams] = useSearchParams();
    const { t } = useTranslation();

    const initialQuery = searchParams.get("q") || "";
    const [localQuery, setLocalQuery] = useState(initialQuery);

    const debouncedQuery = useDebounce(localQuery, 400);

    const initialPage = parseInt(searchParams.get("page") || "1", 10);
    const {
        query,
        list,
        loadingList,
        errorList,
        currentPage,
        totalPages,
        total,
        limit
    } = useSelector((state: RootState) => state.items);

    useEffect(() => {
        dispatch(setQuery(initialQuery));
        dispatch(setPage(initialPage));
    }, []);

    useEffect(() => {
        dispatch(setQuery(debouncedQuery));
        dispatch(setPage(1));
    }, [debouncedQuery]);

    useEffect(() => {
        const params: Record<string, string> = {};
        if (query) params.q = query;
        if (currentPage > 1) params.page = currentPage.toString();

        setSearchParams(params);

        dispatch(fetchProductsByQuery({ query, page: currentPage, limit }));
    }, [query, currentPage, limit]);

    const clearFilter = () => {
        setLocalQuery("");
        dispatch(setQuery(""));
        dispatch(setPage(1));
        setSearchParams({});
    };

    const handlePageChange = (newPage: number) => {
        dispatch(setPage(newPage));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="mt-4">
            <div className="d-flex justify-content-center mb-4">
                <input
                    type="text"
                    placeholder={t('search.placeholder')}
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                    className="form-control rounded-pill me-2"
                    style={{ maxWidth: "400px" }}
                />
                <button
                    className="btn btn-outline-secondary rounded-pill"
                    onClick={clearFilter}
                >
                    {t('search.clear')}
                </button>
            </div>

            {loadingList ? (
                <div className="d-flex justify-content-center align-items-center vh-50">
                    <LoadingSpinner />
                </div>
            ) : errorList ? (
                <ErrorBox message={errorList} />
            ) : list.length > 0 ? (
                <>
                    <div className="d-flex flex-wrap gap-4 justify-content-center">
                        {list.map(product => (
                            <div key={product.id} style={{ width: "20em", height: "100%" }}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center align-items-center mt-4 mb-4">
                            <nav aria-label="Page navigation">
                                <ul className="pagination">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            style={{ color: "#1F2A32" }}
                                            disabled={currentPage === 1}
                                        >
                                            {t('pagination.previous')}
                                        </button>
                                    </li>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                                        if (
                                            pageNum === 1 ||
                                            pageNum === totalPages ||
                                            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                                        ) {
                                            return (
                                                <li key={pageNum}
                                                    className={`page-item ${currentPage === pageNum ? 'active' : ''}`}
                                                >
                                                    <button
                                                        className="page-link"
                                                        style={{ backgroundColor: currentPage === pageNum ? "#2A3A47" : "#FFFFFF",
                                                            color: currentPage === pageNum ? "#ffffff" : "#1F2A32",
                                                            border: 0
                                                         }}
                                                        onClick={() => handlePageChange(pageNum)}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                </li>
                                            );
                                        } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                                            return (
                                                <li key={pageNum} className="page-item disabled">
                                                    <span className="page-link">...</span>
                                                </li>
                                            );
                                        }
                                        return null;
                                    })}

                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            style={{ color: "#1F2A32" }}
                                            disabled={currentPage === totalPages}
                                        >
                                            {t('pagination.next')}
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    )}

                    <div className="text-center text-muted mb-3">
                        {t('pagination.showing', {
                            from: ((currentPage - 1) * limit) + 1,
                            to: Math.min(currentPage * limit, total),
                            total
                        })}
                    </div>
                </>
            ) : (
                <ErrorBox message={t('products.empty')} />
            )}
        </div>
    );
}

export default ProductsList;
