import { useDispatch, useSelector } from "react-redux"

import { setIsFirstParcelConfig, setParcelConfig } from "../redux/reducer/ConfigReducer";

import { IRootState } from "../redux/store";

import { POSTData, PUTData } from "../services/WebServices";
import { toast } from "react-toastify";
import { INITIAL_IRRIGATION } from "../common/Irrigation";
import { setIrrigations } from "../redux/reducer/IrrigationReducer";

const useConfigForm = () => {


  const dispatch = useDispatch();
  const { currentConfig, isFirstParcelConfig } = useSelector((state: IRootState) => state.parcelConfig);

  const rootsLOptions = [
    { value: 10, label: 10 },
    { value: 20, label: 20 },
    { value: 30, label: 30 },
    { value: 40, label: 40 },
    { value: 50, label: 50 },
    { value: 60, label: 60 },
  ]

  const drainLOptions = [
    { value: 10, label: 10 },
    { value: 20, label: 20 },
    { value: 30, label: 30 },
    { value: 40, label: 40 },
    { value: 50, label: 50 },
    { value: 60, label: 60 },
  ]

  const handleChangeRootsL = (value: number) => {
    if (!currentConfig) return;
    dispatch(setParcelConfig({
      ...currentConfig, config: { ...currentConfig.config, rootsL: value }
    }))
  }

  const handleChangeDrainL = (value: number) => {
    if (!currentConfig) return;
    dispatch(setParcelConfig({
      ...currentConfig, config: { ...currentConfig.config, drainL: value }
    }))
  }

  const handleChangeARootsTimelapse = (value: number) => {
    if (!currentConfig) return;
    dispatch(setParcelConfig({
      ...currentConfig, config: { ...currentConfig.config, aRootsTimelapse: value }
    }))
  }

  const handleChangeADrainTimelapse = (value: number) => {
    if (!currentConfig) return;
    dispatch(setParcelConfig({
      ...currentConfig, config: { ...currentConfig.config, aDrainTimelapse: value }
    }))
  }

  const handleChangeRootsLThreshold = (value: number) => {
    if (!currentConfig) return;
    dispatch(setParcelConfig({
      ...currentConfig, config: { ...currentConfig.config, rootsLThreshold: value }
    }))
  }

  const handleChangeDrainLThreshold = (value: number) => {
    if (!currentConfig) return;
    dispatch(setParcelConfig({
      ...currentConfig, config: { ...currentConfig.config, drainLThreshold: value }
    }))
  }

  const handleChangePercentageIncrement = (value: number) => {
    if (!currentConfig) return;
    dispatch(setParcelConfig({
      ...currentConfig, config: { ...currentConfig.config, percentageIncrement: value }
    }))
  }

  const handleChangeBaseIrrigation = (value: number) => {
    if (!currentConfig) return;
    dispatch(setParcelConfig({
      ...currentConfig, config: { ...currentConfig.config, baseIrrigation: value }
    }))
  }

  const handleChangeMinIrrigationTimeMin = (value: number) => {
    if (!currentConfig) return;
    dispatch(setParcelConfig({
      ...currentConfig, config: { ...currentConfig.config, minIrrigationTimeMin: value }
    }))
  }

  const handleChangeMaxIrrigationTimeMin = (value: number) => {
    if (!currentConfig) return;
    dispatch(setParcelConfig({
      ...currentConfig, config: { ...currentConfig.config, maxIrrigationTimeMin: value }
    }))
  }

  const handleChangeInitialDate = (value: string) => {
    if (!currentConfig) return;
    dispatch(setParcelConfig({
      ...currentConfig, config: { ...currentConfig.config, initialDate: value }
    }))
  }

  const handleChangeStartTime1 = (value: string) => {
    if (!currentConfig) return;
    dispatch(setParcelConfig({
      ...currentConfig, config: { ...currentConfig.config, startTime1: value }
    }))
  }

  const handleChangeStartTime2 = (value: string) => {
    if (!currentConfig) return;
    dispatch(setParcelConfig({
      ...currentConfig, config: { ...currentConfig.config, startTime2: value }
    }))
  }

  const handleChangeStartTime3 = (value: string) => {
    if (!currentConfig) return;
    dispatch(setParcelConfig({
      ...currentConfig, config: { ...currentConfig.config, startTime3: value }
    }))
  }

  const handleConfigFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (!currentConfig) return;
      const result = await PUTData(`/config/${currentConfig._id}`, currentConfig)
      if (!result.data) throw new Error("Cannot update parcel config")
      // if (isFirstParcelConfig) createInitialIrrigation();
      localStorage.setItem('IsFirstParcelConfig', '0')
      dispatch(setIsFirstParcelConfig(false))
      toast(!isFirstParcelConfig ? "Condiciones modificadas" : 'Condiciones establecidas')
    } catch (err) {
      console.error(err);
    }
  }

  return {
    isFirstParcelConfig,
    rootsLOptions,
    drainLOptions,
    handleChangeRootsL,
    handleChangeDrainL,
    handleChangeARootsTimelapse,
    handleChangeADrainTimelapse,
    handleChangeRootsLThreshold,
    handleChangeDrainLThreshold,
    handleChangePercentageIncrement,
    handleChangeBaseIrrigation,
    handleChangeMinIrrigationTimeMin,
    handleChangeMaxIrrigationTimeMin,
    handleChangeInitialDate,
    handleChangeStartTime1,
    handleChangeStartTime2,
    handleChangeStartTime3,
    handleConfigFormSubmit
  }
}

export default useConfigForm