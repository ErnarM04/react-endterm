import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {getProductById, getProductsByQuery, Product, ProductsResponse} from "../../services/ItemsService";

export const fetchProductsByQuery = createAsyncThunk(
    'products/fetchProductsByQuery',
    async ({ query, page, limit }: { query: string; page?: number; limit?: number }, thunkAPI) => {
        try {
            return await getProductsByQuery(query, page, limit);
        } catch (error) {
            return thunkAPI.rejectWithValue((error as Error).message)
        }
    }
);

export const fetchProductById = createAsyncThunk(
    'products/fetchProductById',
    async (id: string, thunkAPI) => {
        try {
            return await getProductById(id);
        } catch (error) {
            return thunkAPI.rejectWithValue((error as Error).message)
        }
    }
);

interface ItemsState {
    list: Product[];
    selectedItem: Product | null;
    loadingList: boolean;
    loadingItem: boolean;
    errorList: string | null;
    errorItem: string | null;
    query: string;
    currentPage: number;
    totalPages: number;
    total: number;
    limit: number;
}

const initialState: ItemsState = {
    list: [],
    selectedItem: null,
    loadingList: false,
    loadingItem: false,
    errorList: null,
    errorItem: null,
    query: "",
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10
};

const itemsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setQuery: (state, action: PayloadAction<string>) => {
            state.query = action.payload;
            state.currentPage = 1; // Reset to first page when query changes
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductsByQuery.fulfilled, (state, action) => {
                state.list = action.payload.products;
                state.currentPage = action.payload.page;
                state.totalPages = action.payload.pages;
                state.total = action.payload.total;
                state.limit = action.payload.limit;
                state.loadingList = false;
                state.errorList = null;
            })
            .addCase(fetchProductsByQuery.pending, (state) => {
                state.loadingList = true;
                state.list = [];
                state.errorList = null;
            })
            .addCase(fetchProductsByQuery.rejected, (state, action) => {
                state.loadingList = false;
                state.list = [];
                state.errorList = action.payload as string;
            });

        builder
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.selectedItem = action.payload;
                state.loadingItem = false;
                state.errorItem = null;
            })
            .addCase(fetchProductById.pending, (state) => {
                state.selectedItem = null;
                state.loadingItem = true;
                state.errorItem = null;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loadingItem = false;
                state.selectedItem = null;
                state.errorItem = action.payload as string;
            })

    }
})

export const {setQuery, setPage} = itemsSlice.actions;
export default itemsSlice.reducer;



