import React from 'react'

import useConfigForm from '../../hooks/useConfigForm'
import { useSelector } from 'react-redux';
import { IRootState } from '../../redux/store';

const ConfigForm = () => {

  const { currentConfig } = useSelector((state: IRootState) => state.parcelConfig);

  const { 
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
  } = useConfigForm();

  if (!currentConfig) return;

  return (
    <React.Fragment>
      <h2>Condiciones iniciales</h2>
      <form id="parcelConfigForm" onSubmit={(e) => handleConfigFormSubmit(e)}>
        <div>
          <label htmlFor="rootsL">Profundidad del sensor de raíces (cm):</label>
          <select id="rootsL" name="rootsL" value={currentConfig.config.rootsL} onChange={(e) => handleChangeRootsL(parseInt(e.target.value))} required>
            {
              rootsLOptions.map((currentRootsL) => (
                <option key={`[rootsL]${currentRootsL.value}`} value={currentRootsL.value}>{currentRootsL.label}</option>
              ))
            }
          </select>
        </div>
        <div>
          <label htmlFor="drainL">Profundidad del sensor de drenaje (cm):</label>
          <select id="drainL" name="drainL" value={currentConfig.config.drainL} onChange={(e) => handleChangeDrainL(parseInt(e.target.value))} required>
            {
              drainLOptions.map((currentDrainL) => (
                <option key={`[drainL]${currentDrainL.value}`} value={currentDrainL.value}>{currentDrainL.label}</option>
              ))
            }
          </select>
        </div>
        <div>
          <label htmlFor="aRootsTimelapse">Lapso de tiempo para raíces (h):</label>
          <input 
            type="number" 
            id="aRootsTimelapse" 
            name="aRootsTimelapse" 
            onChange={(e) => handleChangeARootsTimelapse(parseInt(e.target.value))} 
            value={currentConfig.config.aRootsTimelapse} 
            required 
          />
        </div>
        <div>
          <label htmlFor="aDrainTimelapse">Lapso de tiempo para drenaje (h):</label>
          <input 
            type="number" 
            id="aDrainTimelapse" 
            name="aDrainTimelapse" 
            onChange={(e) => handleChangeADrainTimelapse(parseInt(e.target.value))} 
            value={currentConfig.config.aDrainTimelapse} 
            required 
          />
        </div>
        <div>
          <label htmlFor="rootsLThreshold">Umbral de raíces:</label>
          <input 
            type="number" 
            id="rootsLThreshold" 
            name="rootsLThreshold" 
            step="0.01" 
            onChange={(e) => handleChangeRootsLThreshold(parseInt(e.target.value))} 
            value={currentConfig.config.rootsLThreshold} 
            required 
          />
        </div>
        <div>
          <label htmlFor="drainLThreshold">Umbral de drenaje:</label>
          <input 
            type="number" 
            id="drainLThreshold" 
            name="drainLThreshold" 
            step="0.01" 
            onChange={(e) => handleChangeDrainLThreshold(parseInt(e.target.value))} 
            value={currentConfig.config.drainLThreshold} 
            required 
          />
        </div>
        <div>
          <label htmlFor="percentageIncrement">Porcentaje variación (%):</label>
          <input 
            type="number" 
            id="percentageIncrement" 
            name="percentageIncrement" 
            onChange={(e) => handleChangePercentageIncrement(parseInt(e.target.value))} 
            value={currentConfig.config.percentageIncrement} 
            required 
          />
        </div>
        <div>
          <label htmlFor="baseIrrigation">Base de riego (min):</label>
          <input 
            type="number" 
            id="baseIrrigation" 
            name="baseIrrigation" 
            onChange={(e) => handleChangeBaseIrrigation(parseInt(e.target.value))} 
            value={currentConfig.config.baseIrrigation} 
            required 
          />
        </div>
        <div>
          <label htmlFor="minIrrigationTimeMin">Duración mínima de riego (min) :</label>
          <input 
            type="number" 
            id="minIrrigationTimeMin" 
            name="minIrrigationTimeMin" 
            onChange={(e) => handleChangeMinIrrigationTimeMin(parseInt(e.target.value))} 
            value={currentConfig.config.minIrrigationTimeMin} 
            required 
          />
        </div>
        <div>
          <label htmlFor="maxIrrigationTimeMin">Duración máxima de riego (min):</label>
          <input 
            type="number" 
            id="maxIrrigationTimeMin" 
            name="maxIrrigationTimeMin" 
            onChange={(e) => handleChangeMaxIrrigationTimeMin(parseInt(e.target.value))} 
            value={currentConfig.config.maxIrrigationTimeMin} 
            required 
          />
        </div>
        <div>
          <label htmlFor="startTime1">Fecha inicio:</label>
          <input 
            type="date" 
            id="initialDate" 
            name="initialDate" 
            value={currentConfig.config.initialDate} 
            onChange={(e) => handleChangeInitialDate(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label htmlFor="startTime1">Inicio 1° irrigación:</label>
          <input 
            type="time" 
            id="startTime1" 
            name="startTime1" 
            value={currentConfig.config.startTime1} 
            onChange={(e) => handleChangeStartTime1(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label htmlFor="startTime2">Inicio 2° irrigación (opcional):</label>
          <input 
            type="time" 
            id="startTime2"
            name="startTime2" 
            value={currentConfig.config.startTime2} 
            onChange={(e) => handleChangeStartTime2(e.target.value)} 
          />
        </div>
        <div>
          <label htmlFor="startTime3">Inicio 3° irrigación (opcional):</label>
          <input 
            type="time" 
            id="startTime3" 
            name="startTime3" 
            value={currentConfig.config.startTime3} 
            onChange={(e) => handleChangeStartTime3(e.target.value)} 
          />
        </div>
        {/* <button type="button" className="alert" id="resetButton">Restablecer valores iniciales</button> */}
        <button type="submit" value="setInitialConditions">{ isFirstParcelConfig ? 'Establecer configuración inicial' : 'Modificar condiciones iniciales'}</button>

      </form>

      <div className="loading" id="loading">
        <p>Trayendo información de la API...</p>
      </div>
    </React.Fragment>
  )
}

export default ConfigForm