import { configureStore } from "@reduxjs/toolkit";
import configSlice from "./reducer/ConfigReducer";
import irrigationSlice from "./reducer/IrrigationReducer";

const store = configureStore({
  reducer: {
    parcelConfig: configSlice.reducer,
    irrigation: irrigationSlice.reducer
  }
})

export type IRootState = ReturnType<(typeof store)['getState']>

export default store