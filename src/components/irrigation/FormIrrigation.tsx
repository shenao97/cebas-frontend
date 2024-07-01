import React from 'react'

import useFormIrrigation from '../../hooks/useFormIrrigation'
import { useSelector } from 'react-redux';
import { IRootState } from '../../redux/store';

const FormIrrigation = () => {

  const { irrigationConfig } = useSelector((state: IRootState) => state.irrigation);

  const {
    handleChangeBRoots,
    handleChangeARoots,
    handleChangeBDrain,
    handleChangeADrain,
    onClickGetSensors,
    handleIrrigationFormSubmit
  } = useFormIrrigation();

  return (
    <React.Fragment>
      <h2>Formulario de Irrigación</h2>
      <form id="irrigationForm" onSubmit={(e) => handleIrrigationFormSubmit(e)}>
        {/* <div>
          <label htmlFor="controllerId">Id del controlador:</label>
          <input type="text" id="controllerId" name="controllerId" value="IPex12:00052" required>
        </div>
        <div>
          <label htmlFor="deviceId">Id de la sonda:</label>
          <input type="text" id="deviceId" name="deviceId" value="sdi12_5f1abe29f7d565578dd3e044_Humidity" required>
        </div> */}
        <div>
          <label htmlFor="bRoots">Medición sensor de raices antes de riego:</label>
          <input type="number" id="bRoots" name="bRoots" step="0.01" onChange={(e) => handleChangeBRoots(parseInt(e.target.value))} value={irrigationConfig.bRoots} required />
        </div>
        <div>
          <label htmlFor="aRoots">Medición sensor de raices despues de riego:</label>
          <input type="number" id="aRoots" name="aRoots" step="0.01" onChange={(e) => handleChangeARoots(parseInt(e.target.value))} value={irrigationConfig.aRoots} required />
        </div>
        <div>
          <label htmlFor="bDrain">Medición sensor de drenaje antes de riego:</label>
          <input type="number" id="bDrain" name="bDrain" step="0.01" onChange={(e) => handleChangeBDrain(parseInt(e.target.value))} value={irrigationConfig.bDrain} required />
        </div>
        <div>
          <label htmlFor="aDrain">Medición sensor de drenaje despues de riego:</label>
          <input type="number" id="aDrain" name="aDrain" step="0.01" onChange={(e) => handleChangeADrain(parseInt(e.target.value))} value={irrigationConfig.aDrain} required />
        </div>
        <button type="button" id="getSensorData" onClick={onClickGetSensors}>Consultar sensores</button>
        <button type="submit" value="Calcular Próximo Riego">Calcular próximo riego</button>
      </form>
    </React.Fragment>
  )
}

export default FormIrrigation