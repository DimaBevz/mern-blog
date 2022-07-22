// за допомогою цієї ф-ї ми створимо типу редьюсер, но він називається в нас "слайс", бо юзаємо "redux-toolkit"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../configure/axios";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const { data } = await axios.get("/posts");
  return data;
});

export const fetchRemovePosts = createAsyncThunk(
  "posts/fetchRemovePosts",
  async (id) => {
    await axios.delete(`/posts/${id}`);
  }
);

export const fetchTags = createAsyncThunk("posts/fetchTags", async () => {
  const { data } = await axios.get("/tags");
  return data;
});

export const fetchComments = createAsyncThunk(
  "comments/fetchComments", async (postId) => {
    const { data } = await axios.get(`/comments/${postId}`);
    return data;
  }
);

const initialState = {
  posts: {
    items: [],
    status: "loading",
  },
  tags: {
    items: [],
    status: "loading",
  },
  comments: {
      items: [],
      status: "loading",
  }
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  // тут будуть методи, які будуть допомагати оновлювати наш стейт
  reducers: {},
  // тут ми описуємо стан нашого асинхронного екшену
  extraReducers: {
    // ми говоримо, якщо прийшов запит "пендінг" у редакс, то ми в нашому стейті в постах ставимо статус "loading"
    [fetchPosts.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = "loading";
    },
    // якщо "fulfilled", то загрузка завершена
    [fetchPosts.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = "loaded";
    },
    [fetchPosts.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = "error";
    },

    // tags
    [fetchTags.pending]: (state) => {
      state.tags.items = [];
      state.tags.status = "loading";
    },
    [fetchTags.fulfilled]: (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = "loaded";
    },
    [fetchTags.rejected]: (state) => {
      state.tags.items = [];
      state.tags.status = "error";
    },

    // remove post
    [fetchRemovePosts.pending]: (state, action) => {
      state.posts.items = state.posts.items.filter(
        (obj) => obj._id !== action.meta.arg
      );
    },

    // comments
    [fetchComments.pending]: (state) => {
      state.comments.items = [];
      state.comments.status = "loading";
    },
    [fetchComments.fulfilled]: (state, action) => {
      state.comments.items = action.payload;
      state.comments.status = "loaded";
    },
    [fetchComments.rejected]: (state) => {
      state.comments.items = [];
      state.comments.status = "error";
    },
  },
});

export const postsReducer = postsSlice.reducer;
