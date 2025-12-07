import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { saveProfilePicture, getProfilePicture, getUserProfile, UserProfile } from "../../services/profileService";

// Async thunks
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (userId: string, thunkAPI) => {
    try {
      const profile = await getUserProfile(userId);
      return profile;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

export const uploadProfilePicture = createAsyncThunk(
  'profile/uploadProfilePicture',
  async ({ userId, photoBase64 }: { userId: string; photoBase64: string }, thunkAPI) => {
    try {
      await saveProfilePicture(userId, photoBase64);
      return photoBase64;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

export const removeProfilePicture = createAsyncThunk(
  'profile/removeProfilePicture',
  async (userId: string, thunkAPI) => {
    try {
      await saveProfilePicture(userId, '');
      return null;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

interface ProfileState {
  profile: UserProfile | null;
  photoURL: string | null;
  loading: boolean;
  uploading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  photoURL: null,
  loading: false,
  uploading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.photoURL = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.photoURL = action.payload?.photoURL || null;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadProfilePicture.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadProfilePicture.fulfilled, (state, action) => {
        state.photoURL = action.payload;
        state.uploading = false;
        state.error = null;
        if (state.profile) {
          state.profile.photoURL = action.payload;
        }
      })
      .addCase(uploadProfilePicture.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload as string;
      })
      .addCase(removeProfilePicture.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(removeProfilePicture.fulfilled, (state) => {
        state.photoURL = null;
        state.uploading = false;
        state.error = null;
        if (state.profile) {
          state.profile.photoURL = undefined;
        }
      })
      .addCase(removeProfilePicture.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;

