import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../configure/axios";

export const fetchAuth = createAsyncThunk("auth/fetchAuth", async (params) => {
  // пишемо "post", бо ця ф-я отримує дані з форми і ми передамо ці дані на бек
  // бек дасть нам відповідь з нашою інф-ю (якщо все пройшло добре) і ми збережемо її в редакс
  // у "params" у нас буде зберігатись "email & password"
  const { data } = await axios.post("/auth/login", params);
  return data;
});

export const fetchAuthMe = createAsyncThunk("auth/fetchAuthMe", async () => {
  const { data } = await axios.get("/auth/me");
  return data;
});

export const fetchRegister = createAsyncThunk(
  "auth/fetchRegister",
  async (params) => {
    const { data } = await axios.post("/auth/register", params);
    return data;
  }
);

const initialState = {
  // пояснюємо, що інф-я про юзера буде зберігатись у data
  data: null,
  status: "loading",
};

const authSlice = createSlice({
  // пищемо, що наш слайс буде називатись "auth"
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      // при виході скидаємо дату на нул і ми будемо не авторизовані
      state.data = null;
    },
  },
  extraReducers: {
    [fetchAuth.pending]: (state) => {
      state.status = "loading";
      state.data = null;
    },
    [fetchAuth.fulfilled]: (state, action) => {
      state.status = "loaded";
      state.data = action.payload;
    },
    [fetchAuth.rejected]: (state) => {
      state.status = "error";
      state.data = null;
    },
    // me
    [fetchAuthMe.pending]: (state) => {
      state.status = "loading";
      state.data = null;
    },
    [fetchAuthMe.fulfilled]: (state, action) => {
      state.status = "loaded";
      state.data = action.payload;
    },
    [fetchAuthMe.rejected]: (state) => {
      state.status = "error";
      state.data = null;
    },
    // register
    [fetchRegister.pending]: (state) => {
      state.status = "loading";
      state.data = null;
    },
    [fetchRegister.fulfilled]: (state, action) => {
      state.status = "loaded";
      state.data = action.payload;
    },
    [fetchRegister.rejected]: (state) => {
      state.status = "error";
      state.data = null;
    },
  },
});

export const selectisAuth = (state) => Boolean(state.auth.data);

export const authReducer = authSlice.reducer;

// беремо потрібний нам екшен
export const { logout } = authSlice.actions; // експортуємо з "authSlice" усі екшени
