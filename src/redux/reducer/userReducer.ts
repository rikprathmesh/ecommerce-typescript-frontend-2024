// here goes all reducers we can build using toolkit
// like cartReducer etc

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserReducerInitialState } from "../../types/reducer-types";
import { User } from "../../types/types";


const initialState: UserReducerInitialState = {
    user: null,
    loading: true 
}

export const userReducer = createSlice({
    name: "userReducer",
    initialState,
    reducers: {
        userExist: (state, action: PayloadAction<User>) => {
            state.loading = false,
            state.user = action.payload
        },
        userNotExist: (state) => {
            state.loading = false,
            state.user = null
        },
    }
})

export const {userExist, userNotExist} = userReducer.actions