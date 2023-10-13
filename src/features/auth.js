import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    user: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

export const LoginUser = createAsyncThunk('user/LoginUser', async (user, thunkAPI) => {
    try {
        const response = await axios.post(process.env.REACT_APP_API_URL+'/login', {
            email: user.email,
            password: user.password
        })
        return response.data
    } catch (error) {
        if (error.response) {
            const message = error.response.data.message
            return thunkAPI.rejectWithValue(message)
        }
        const message = "There's something error, please contact your administrator or try again later."
        return thunkAPI.rejectWithValue(message)
    }
})

export const userLoggedIn = createAsyncThunk('user/userLoggedIn', async (_, thunkAPI) => {
    try {
        const response = await axios.get(process.env.REACT_APP_API_URL+'/loggedIn')
        return response.data
    } catch (error) {
        if (error.response) {
            const message = error.response.data.message
            return thunkAPI.rejectWithValue(message)
        }
        const message = "There's something error, please contact your administrator or try again later."
        return thunkAPI.rejectWithValue(message)
    }
})

export const LogOut = createAsyncThunk('user/logout', async (_, thunkAPI) => {
    await axios.delete(process.env.REACT_APP_API_URL+'/logout')
})

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(LoginUser.pending, (state) => {
            state.isLoading = true
        })
        builder.addCase(LoginUser.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.user = action.payload
            state.message = ""
        })
        builder.addCase(LoginUser.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })

        // userLoggedIn
        builder.addCase(userLoggedIn.pending, (state) => {
            state.isLoading = true
        })
        builder.addCase(userLoggedIn.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.user = action.payload
            state.message = ""
        })
        builder.addCase(userLoggedIn.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        
        // LogOut
        // builder.addCase(LogOut.pending, (state) => {
        //     state.isLoading = true
        // })
        // builder.addCase(LogOut.fulfilled, (state, action) => {
        //     state.isLoading = false
        //     state.isSuccess = true
        // })
        // builder.addCase(LogOut.rejected, (state, action) => {
        //     state.isLoading = false
        //     state.isError = true
        //     state.message = action.payload
        // })
    }
})

export const {reset} = authSlice.actions
export default authSlice.reducer