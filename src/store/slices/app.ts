import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type AppState = {
  commentValue: string;
  searchValue: string;
  isOpen: boolean;
  message: string;
}

const initialState: AppState = {
  commentValue: '',
  searchValue: '',
  isOpen: false,
  message: ''
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    clearComValue: (state) => {
      state.commentValue = ''
    },
    updateComValue: (state, action: PayloadAction<string>) => {
      state.commentValue = action.payload
    },
    changeSearchValue: (state, action: PayloadAction<string>) => {
      state.searchValue = action.payload
    },
    clearSearchValue: (state) => {
      state.searchValue = ''
    },
    openAlert: (state, action: PayloadAction<string>) => {
      state.isOpen = true
      state.message = action.payload
    },
    closeAlert: (state) => {
      state.isOpen = false
      state.message = ''
    }
  }
})

export const { 
  clearComValue, 
  updateComValue,
  changeSearchValue,
  clearSearchValue,
  openAlert,
  closeAlert
} = appSlice.actions
export default appSlice.reducer