import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IParcelConfig } from '../../interfaces/Config';

export interface IParcelConfigInitialState {
  currentConfig: IParcelConfig | null,
  isFirstParcelConfig: boolean
}

const initialState: IParcelConfigInitialState = {
  currentConfig: null,
  isFirstParcelConfig: true
}

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setParcelConfig: (state, { payload }: PayloadAction<IParcelConfig>) => {
      state.currentConfig = payload
    },
    setIsFirstParcelConfig: (state, { payload }: PayloadAction<boolean>) => {
      state.isFirstParcelConfig = payload
    }
  }
});

export const { setParcelConfig, setIsFirstParcelConfig } = configSlice.actions

export default configSlice;