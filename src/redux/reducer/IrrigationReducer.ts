import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IIrrigation, IIrrigationConfig } from '../../interfaces/Irrigation';
import { INITIAL_IRRIGATION_CONFIG } from '../../common/Irrigation';

export interface IIrrigationInitialState {
  irrigations: IIrrigation[],
  irrigationConfig: IIrrigationConfig
}

const initialState: IIrrigationInitialState = {
  irrigations: [],
  irrigationConfig: INITIAL_IRRIGATION_CONFIG
}

const irrigationSlice = createSlice({
  name: 'irrigation',
  initialState,
  reducers: {
    setIrrigations: (state, { payload }: PayloadAction<IIrrigation[]>) => {
      state.irrigations = payload
    },
    setIrrigationConfig: (state, { payload }: PayloadAction<IIrrigationConfig>) => {
      state.irrigationConfig = payload
    },
  }
});

export const { setIrrigations, setIrrigationConfig } = irrigationSlice.actions

export default irrigationSlice;