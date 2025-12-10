const URL = "https://fastapi-endterm.onrender.com/products";

export interface Product {
    id: number;
    name: string;
    name_ru?: string;
    price: number;
    description: string;
    description_ru?: string;
    category: string;
    category_ru?: string;
    brand: string;
    stock: number;
    rating: number;
    images: string;
    thumbnail: string;
}

export interface ProductsResponse {
    products: Product[];
    total: number;
    page: number;
    pages: number;
    limit: number;
}

export async function getProductById(id: string): Promise<Product> {
    const res = await fetch(`${URL}/${id}`);
    return res.json();
}

export async function getProductsByQuery(query: string, page: number = 1, limit: number = 10): Promise<ProductsResponse> {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    const res = await fetch(`${URL}?${params.toString()}`);
    return res.json();
}



