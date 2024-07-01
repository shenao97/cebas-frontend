import moment from "moment";
import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux"
import { setIrrigationConfig, setIrrigations } from "../redux/reducer/IrrigationReducer";
import { IRootState } from "../redux/store"

import { GETData, POSTData } from "../services/WebServices";

import { IIrrigation, IIrrigationConfig } from "../interfaces/Irrigation";
import { IConfig, IParcelConfig } from "../interfaces/Config";

const API_HOST_EXTERNAL = import.meta.env.VITE_API_HOST_EXTERNAL;
const CONTROLLER_ID = import.meta.env.VITE_CONTROLLER_ID;
const DEVICE_ID = import.meta.env.VITE_DEVICE_ID;

const useFormIrrigation = () => {

  const dispatch = useDispatch();

  const { currentConfig } = useSelector((state: IRootState) => state.parcelConfig);
  const { irrigations, irrigationConfig } = useSelector((state: IRootState) => state.irrigation);

  const DAY_IN_MS = (24 * 60 * 60 * 1000);

  const handleChangeBRoots = (value: number) => {
    dispatch(setIrrigationConfig({ ...irrigationConfig, bRoots: value }))
  }

  const handleChangeARoots = (value: number) => {
    dispatch(setIrrigationConfig({ ...irrigationConfig, aRoots: value }))
  }

  const handleChangeBDrain = (value: number) => {
    dispatch(setIrrigationConfig({ ...irrigationConfig, bDrain: value }))
  }

  const handleChangeADrain = (value: number) => {
    dispatch(setIrrigationConfig({ ...irrigationConfig, aDrain: value }))
  }

  const onClickGetSensors = () => {
    getSensors()
  }

  const getSensors = async () => {
    const loading = document.getElementById("loading")
    if (!currentConfig || !loading) return;
    loading.style.display = "block";

    try {
      const aRootsTimelapse = parseInt(currentConfig.config.aRootsTimelapse + "")
      const aDrainTimelapse = parseInt(currentConfig.config.aDrainTimelapse + "")
      const rootsLevel = (currentConfig.config.rootsL / 10) - 1
      const drainLevel = (currentConfig.config.drainL / 10) - 1
      const measureTimeLapse = Math.max(aDrainTimelapse, aRootsTimelapse);

      const nextEndTime = calculateNextEndTime();
      const lastIrrigationTime = moment(nextEndTime).utcOffset(60);
      const startTime = lastIrrigationTime.clone();
      const endTime = startTime.clone().add(measureTimeLapse, 'hour');
      const dateFrom = startTime.toISOString();
      const dateTo = endTime.toISOString();

      const partialEndpoint = `/backend/STH/v1/contextEntities/type/Device/id/${CONTROLLER_ID}/attributes/${DEVICE_ID}`;
      const completeEndpoint = `${partialEndpoint}?dateFrom=${dateFrom}&dateTo=${dateTo}`

      let sensorsResult;
      try {
        sensorsResult = await GETData(completeEndpoint, API_HOST_EXTERNAL)
      } catch (err) {
        toast('Error al obtener los datos. Por favor introduzca la información manualmente o vuelva a intentarlo')
        throw new Error('Error getting sensors data')
      }

      const firstResponse = sensorsResult.contextResponses[0];
      const lastResponse = sensorsResult.contextResponses[sensorsResult.contextResponses.length - 1];

      const firstValues = firstResponse.contextElement.attributes[0].values;
      const firstValue = firstValues[0];
      const firstAttrValue = firstValue.attrValue;

      const lastValues = lastResponse.contextElement.attributes[0].values;
      const lastValue = lastValues[lastValues.length - 1];
      const lastAttrValue = lastValue.attrValue;

      const newConfigIrrigation = {
        bRoots: firstAttrValue[rootsLevel],
        aRoots: lastAttrValue[rootsLevel],
        bDrain: firstAttrValue[drainLevel],
        aDrain: lastAttrValue[drainLevel],
      }

      updateConfigIrrigation(newConfigIrrigation);
    } catch (err) {
      console.error(err);
    } finally {
      loading.style.display = "none"
    }
  }

  const calculateNextEndTime = () => {
    if (irrigations.length > 0) {
      const nonPendingConfigurations = irrigations.filter(currentIrrigation => !currentIrrigation.isPending);
      if (nonPendingConfigurations.length > 0) {
        const lastNonPendingConfig = nonPendingConfigurations[nonPendingConfigurations.length - 1];
        const lastEndTime = moment(lastNonPendingConfig.endTime);
        const minutes = lastEndTime.minutes();
        if (minutes >= 0 && minutes < 30) {
          lastEndTime.minutes(30);
        } else {
          lastEndTime.add(1, 'hours').startOf('hour').minutes(0);
        }
        const formattedNextEndTime = lastEndTime.format("YYYY-MM-DD HH:mm:ss");
        return formattedNextEndTime;
      } else {
        toast('No hay configuraciones pendientes.');
        throw new Error("There're not pending irrigation");
      }
    } else {
      toast('No hay configuraciones almacenadas.');
      throw new Error("There're not available irrigations");
    }
  }

  const updateConfigIrrigation = (newConfigIrrigation: IIrrigationConfig) => {
    dispatch(setIrrigationConfig(newConfigIrrigation))
  }

  const handleIrrigationFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (!currentConfig) return;

      const initialDataFromDevices = {
        aRoots: irrigationConfig.aRoots,
        aDrain: irrigationConfig.aDrain,
        bRoots: irrigationConfig.bRoots,
        bDrain: irrigationConfig.bDrain,
        irrigationStart: `${currentConfig.config.initialDate} ${currentConfig.config.startTime1} `,
        irrigationEnd: moment(`${currentConfig.config.initialDate} ${currentConfig.config.startTime1}`).clone().add(currentConfig.config.baseIrrigation * 60 * 1000, "milliseconds").format("YYYY-MM-DD HH:mm:ss"),
      };

      let parcelConfig: IIrrigation | IParcelConfig = currentConfig;
      let dataFromDevices = initialDataFromDevices;
      let numberOfIrrigations = 1;

      const pendingIrrigations = irrigations.filter(current_irrigation => current_irrigation.isPending);

      if (irrigations.length) {
        const notPendingIrrigations = irrigations.filter(current_irrigation => !current_irrigation.isPending);
        const irrigationStart = notPendingIrrigations[notPendingIrrigations.length - 1].startTime;
        const irrigationEnd = notPendingIrrigations[notPendingIrrigations.length - 1].endTime;
        parcelConfig = notPendingIrrigations[notPendingIrrigations.length - 1];
        dataFromDevices = { ...initialDataFromDevices, irrigationStart, irrigationEnd };

        if (irrigations.length > 1) {
          let index = irrigations.length - 2;
          let differentDate = false;
          while (index >= 0 && !differentDate) {
            const previousIrrigation = irrigations[index];
            const currentIrrigation = irrigations[index + 1];
            if (currentIrrigation.startTime.split(' ')[0] !== previousIrrigation.startTime.split(' ')[0]) {
              differentDate = true;
            } else {
              numberOfIrrigations++;
              index--;
            }
          }
        }
      }

      if (pendingIrrigations.length > 0) {
        updateIrrigation(parcelConfig.parcelName, parcelConfig.config, pendingIrrigations, dataFromDevices);
      } else {
        scheduleIrrigation(parcelConfig.parcelName, parcelConfig.config, numberOfIrrigations, dataFromDevices);
      }
    } catch (err) {
      console.error(err)
    }

  }

  const scheduleIrrigation = async (parcelName: string, config: IConfig, previousNumberOfIrrigations: number, dataFromDevices: { aRoots: number, bRoots: number, aDrain: number, bDrain: number, irrigationStart: string, irrigationEnd: string }) => {
    try {
      if(!currentConfig) return;
      const newIrrigations = [...irrigations];
      let nextIrrigation = calculateNextIrrigation({ ...config, baseIrrigation: config.baseIrrigation * previousNumberOfIrrigations }, dataFromDevices);
      const incrementPercentage = nextIrrigation.incrementPercentage / 100;
      const numberOfIrrigations = nextIrrigation.numberOfIrrigations;
      let newBaseIrrigation = calcNewBaseIrrigation(config, config.baseIrrigation * previousNumberOfIrrigations, incrementPercentage, numberOfIrrigations);

      let previousStartIrrigation = moment(dataFromDevices.irrigationStart);
      const currentDate = previousStartIrrigation
        .clone()
        .add(DAY_IN_MS, "milliseconds")
        .format("YYYY-MM-DD");

      let irrigationRanges = []
      if (numberOfIrrigations === 2) {
        irrigationRanges = [
          moment(currentDate + " " + config.startTime1 + ":00"),
          moment(currentDate + " " + config.startTime2 + ":00")
        ]
      } else if (numberOfIrrigations === 3) {
        irrigationRanges = [
          moment(currentDate + " 06:00:00"),
          moment(currentDate + " 12:00:00"),
          moment(currentDate + " 18:00:00"),
        ]
      } else if (numberOfIrrigations === 4) {
        irrigationRanges = [
          moment(currentDate + " 06:00:00"),
          moment(currentDate + " 10:00:00"),
          moment(currentDate + " 14:00:00"),
          moment(currentDate + " 18:00:00"),
        ]
      } else {
        irrigationRanges = [
          moment(currentDate + " " + config.startTime1 + ":00"),
        ]
      }

      for (let i = 0; i < numberOfIrrigations; i++) {
        const last_index = newIrrigations.length ? newIrrigations[newIrrigations.length - 1].id : 0;
        const duration = newBaseIrrigation * 60 * 1000;
        const startTime = moment(irrigationRanges[i])
          .clone()
          .format("YYYY-MM-DD HH:mm:ss");
        const endTime = moment(startTime)
          .clone()
          .add(duration, "milliseconds")
          .format("YYYY-MM-DD HH:mm:ss");

        const newConfig = {
          ...config,
          baseIrrigation: newBaseIrrigation,
          percentageIncrement: incrementPercentage * 100
        }
        const irrigation = {
          id: last_index + 1,
          isPending: i !== 0,
          parcelName: parcelName,
          config: newConfig,
          startTime,
          endTime,
        }
        const result = await POSTData('/irrigation', { irrigation, configId: currentConfig._id})
        if (!result.data) throw new Error('Irrigation could not being saved.')
        newIrrigations.push(result.data);
      }

      dispatch(setIrrigations(newIrrigations))
    } catch (err) {
      toast('Error calculando riego')
      throw new Error('Error scheduling irrigation')
    }
  }

  const updateIrrigation = (parcelName: string, config: IConfig, pendingIrrigations: IIrrigation[], dataFromDevices: { aRoots: number, bRoots: number, aDrain: number, bDrain: number, irrigationStart: string, irrigationEnd: string }) => {
    let nextIrrigation = calculateNextIrrigation(config, dataFromDevices);
    const incrementPercentage = nextIrrigation.incrementPercentage / 100;
    const numberOfIrrigations = 1;
    let newBaseIrrigation = calcNewBaseIrrigation(config, config.baseIrrigation, incrementPercentage, numberOfIrrigations);

    const duration = newBaseIrrigation * 60 * 1000;
    const startTime = moment(pendingIrrigations[0].startTime)
      .clone()
      .format("YYYY-MM-DD HH:mm:ss");
    const endTime = moment(startTime)
      .clone()
      .add(duration, "milliseconds")
      .format("YYYY-MM-DD HH:mm:ss");

    const newConfig = {
      ...config,
      baseIrrigation: newBaseIrrigation,
      percentageIncrement: incrementPercentage * 100
    }
    const irrigation = {
      ...pendingIrrigations[0],
      isPending: false,
      parcelName: parcelName,
      config: newConfig,
      endTime,
    }

    const newIrrigations = [...irrigations]
    newIrrigations[newIrrigations.length - pendingIrrigations.length] = irrigation;
    dispatch(setIrrigations(newIrrigations))
  }

  const calculateNextIrrigation = (p_config: IConfig, p_dataRetrieved: { aRoots: number, bRoots: number, aDrain: number, bDrain: number, irrigationStart: string, irrigationEnd: string }) => {
    let internalResponseDataset = {
      incrementPercentage: NaN,
      totalTime: NaN,
      numberOfIrrigations: NaN,
    };

    if (
      p_dataRetrieved.aRoots == -1 ||
      p_dataRetrieved.bRoots == -1 ||
      p_dataRetrieved.aDrain == -1 ||
      p_dataRetrieved.bDrain == -1
    ) {
      internalResponseDataset.incrementPercentage = 0;
      internalResponseDataset.totalTime = p_config.baseIrrigation;
      internalResponseDataset.numberOfIrrigations = 0;
    } else {
      let irrigationTime =
        Math.abs(
          new Date(p_dataRetrieved.irrigationStart).getTime() -
          new Date(p_dataRetrieved.irrigationEnd).getTime(),
        ) / 60000;
      if (
        p_dataRetrieved.aDrain - p_dataRetrieved.bDrain >
        p_config.drainLThreshold
      ) {
        internalResponseDataset.incrementPercentage = -15;
        internalResponseDataset.totalTime =
          irrigationTime -
          (irrigationTime * p_config.percentageIncrement) / 100;
        internalResponseDataset.numberOfIrrigations = calculateNumberOfIrrigation(internalResponseDataset, p_config);
      } else {
        if (
          p_dataRetrieved.aRoots - p_dataRetrieved.bRoots <
          p_config.rootsLThreshold
        ) {
          internalResponseDataset.incrementPercentage = 15;
          internalResponseDataset.totalTime =
            irrigationTime +
            (irrigationTime * p_config.percentageIncrement) / 100;
          internalResponseDataset.numberOfIrrigations =
            calculateNumberOfIrrigation(internalResponseDataset, p_config);
        } else {
          internalResponseDataset.incrementPercentage = 0;
          internalResponseDataset.totalTime = irrigationTime;
          internalResponseDataset.numberOfIrrigations =
            calculateNumberOfIrrigation(internalResponseDataset, p_config);
        }
      }
      if (
        internalResponseDataset.totalTime < p_config.minIrrigationTimeMin
      )
        internalResponseDataset.totalTime = p_config.minIrrigationTimeMin;
    }
    return internalResponseDataset;
  }

  const calculateNumberOfIrrigation = (internalResponseDataset: any, p_config: IConfig) => {
    let nIrrigations = 1;
    const baseIrrigation = p_config.baseIrrigation;
    const incrementPercentage = internalResponseDataset.incrementPercentage / 100;

    const nextIrrigationValue = baseIrrigation * (incrementPercentage >= 0 ? 1 + incrementPercentage : 1 + incrementPercentage)
    let tempIrrigationValue = nextIrrigationValue;
    while (tempIrrigationValue > p_config.maxIrrigationTimeMin) {
      nIrrigations++;
      tempIrrigationValue = nextIrrigationValue / nIrrigations;
    }
    while (tempIrrigationValue < p_config.minIrrigationTimeMin) {
      nIrrigations--;
      tempIrrigationValue = nextIrrigationValue / nIrrigations;
    }
    return nIrrigations;
  }

  const calcNewBaseIrrigation = (config: IConfig, baseIrrigation: number, increment: number, numberOfIrrigations: number) => {
    let newBaseIrrigation = Math.round((baseIrrigation * (increment > 0 ? 1 + increment : 1 + increment)) / numberOfIrrigations);

    if (newBaseIrrigation < config.minIrrigationTimeMin) {
      newBaseIrrigation = config.minIrrigationTimeMin;
    }
    if (newBaseIrrigation > config.maxIrrigationTimeMin) {
      newBaseIrrigation = config.maxIrrigationTimeMin;
    }
    return newBaseIrrigation
  }

  return {
    handleChangeBRoots,
    handleChangeARoots,
    handleChangeBDrain,
    handleChangeADrain,
    handleIrrigationFormSubmit,
    onClickGetSensors
  }
}

export default useFormIrrigation