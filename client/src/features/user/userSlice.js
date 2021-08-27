import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { userAPI } from './userAPI';

const initialState = {
  isLoggedIn: false,
  isProfileOpened: false
};

// update user in store profile thunk
export const updateUserInStore = createAsyncThunk('users/updateUserInStore', userAPI.updateUserInStore)

// login thunk
export const login = createAsyncThunk('users/login', userAPI.login);

// register thunk
export const register = createAsyncThunk('users/register', userAPI.register)

// edit profile thunk
export const editProfile = createAsyncThunk('users/edit-profile', async (params, { dispatch, rejectWithValue }) => {
  try {
    var response = await userAPI.editProfile(params);
    // update user in store after profile edited
    dispatch(updateUserInStore());
    return response;
  } catch(err) {
    return rejectWithValue(err);
  }
})

// checkUserLogin thunk
export const checkUserLogin = createAsyncThunk('users/checkUserLogin', userAPI.checkUserLogin)

// deposit thunk
export const deposit = createAsyncThunk('users/deposit', async (params, { dispatch, rejectWithValue }) => {
  try {
    var response = await userAPI.deposit(params);
    // update user in store after deposit
    dispatch(updateUserInStore());
    return response;
  } catch(err) {
    return rejectWithValue(err);
  }
})


// create user slice
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleProfile: (state) => {
      state.isProfileOpened = !state.isProfileOpened;
      state.editProfileErrorMsg && (state.editProfileErrorMsg = undefined);
      state.editProfileSuccessMsg && (state.editProfileSuccessMsg = undefined);
    },
    toggleDeposit: (state) => {
      state.isDepositOpened = !state.isDepositOpened;
      state.depositErrorMsg && (state.depositErrorMsg = undefined);
      state.depositSuccessMsg && (state.depositSuccessMsg = undefined);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, { payload: { email, name, surname, saldo, role } }) => {
        state.isLoggedIn = true;
        state.email = email;
        state.name = name;
        state.surname = surname;
        state.balance = saldo;
        state.role = role;
      })
    builder
      .addCase(checkUserLogin.fulfilled, (state, { payload: { email, name, surname, saldo, role } }) => {
        state.isLoggedIn = true;
        state.email = email;
        state.name = name;
        state.surname = surname;
        state.balance = saldo;
        state.role = role;
      })
    builder
      .addCase(editProfile.fulfilled, (state, { payload: { msg, newName, newSurname } }) => {
        state.editProfileSuccessMsg = msg;
      })
      .addCase(editProfile.rejected, (state, { payload: { error } }) => {
        state.editProfileErrorMsg = error;
      })
    builder
      .addCase(deposit.fulfilled, (state, { payload: { msg, amount } }) => {
        state.depositSuccessMsg = msg;
        state.balance += parseFloat(amount);
      })
      .addCase(deposit.rejected, (state, { payload: { error } }) => {
        state.depositErrorMsg = error;
      })
    builder
      .addCase(updateUserInStore.fulfilled, (state, { payload: { email, name, surname, saldo, role } }) => {
        state.email = email;
        state.name = name;
        state.surname = surname;
        state.balance = saldo;
        state.role = role;
      })
  },
})

export const { toggleProfile, toggleDeposit } = userSlice.actions;

export default userSlice.reducer;