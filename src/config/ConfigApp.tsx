import React from 'react'
import moment from 'moment';

import { useDispatch, useSelector } from 'react-redux';
import { setIrrigations } from '../redux/reducer/IrrigationReducer';
import { setIsFirstParcelConfig, setParcelConfig } from '../redux/reducer/ConfigReducer';

import { GETData, POSTData } from '../services/WebServices';

import { INITIAL_CONFIG } from '../common/Config';

import { IIrrigation } from '../interfaces/Irrigation';
import { IParcelConfig } from '../interfaces/Config';
import { IRootState } from '../redux/store';

interface IConfigAppProps {
  children: JSX.Element[] | JSX.Element | string | string[]
}
const ConfigApp = ({ children }: IConfigAppProps) => {

  const dispatch = useDispatch();

  const { currentConfig } = useSelector((state: IRootState) => state.parcelConfig);

  const setupInitialConfig = async () => {
    try {
      const result = await GETData('/config');
      if (result.data.length === 0) {
        const result = await POSTData("/config", INITIAL_CONFIG);
        if(!result.data) throw new Error("Cannot save initial config");
        localStorage.setItem('IsFirstParcelConfig', '1')
        dispatch(setIsFirstParcelConfig(true))
        saveConfig(result.data)
        return;
      }
      const storageIsFirstParcelConfig = localStorage.getItem('IsFirstParcelConfig')
      dispatch(setIsFirstParcelConfig(storageIsFirstParcelConfig === '1' || storageIsFirstParcelConfig === undefined))
      const initialParcelConfig = result.data[0];
      saveConfig(initialParcelConfig)
    } catch (error) {
      console.error('Error getting initial config', error);
    }
  }

  const setupIrrigations = async() => {
    try{
      if(!currentConfig) return;
      const irrigations = await getIrrigations();
      if (irrigations.length > 0) {
        saveIrrigations(irrigations);
        return;
      }
    }catch(err){
      console.error('Error getting initial irrigations', err);
    }
  }

  const getIrrigations = async () => {
    try {
      const data = await GETData('/irrigation');
      const nextIrrigations = data.data || [];
      return nextIrrigations;
    } catch (error) {
      console.error('Error getting irrigations', error);
    }
  }

  const saveConfig = (newConfig: IParcelConfig) => dispatch(setParcelConfig(newConfig));

  const saveIrrigations = (irrigations: IIrrigation[]) => dispatch(setIrrigations(irrigations));

  React.useEffect(() => {
    setupIrrigations();
  }, [currentConfig])

  React.useEffect(() => {
    setupInitialConfig()
  }, [])

  return (
    <React.Fragment>{children}</React.Fragment>
  )
}

export default ConfigApp