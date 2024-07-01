import { useEffect, useState } from 'react';

import ReactDOM from 'react-dom'

import { IIrrigation } from '../../interfaces/Irrigation';

interface IIrrigationModalProps {
  irrigationSelected: IIrrigation | null,
  close: Function,
  save: Function
}
const IrrigationModal = ({ irrigationSelected, close, save }: IIrrigationModalProps) => {
  const modalContainer = document.getElementById('modal');

  const [newIrrigationConfig, setNewIrrigationConfig] = useState<IIrrigation | null>();

  useEffect(() => {
    if (!irrigationSelected) return;
    setNewIrrigationConfig({...irrigationSelected})
  }, [irrigationSelected])

  const handleChangeBaseIrrigation = (value: number) => {
    if(!newIrrigationConfig) return;
    setNewIrrigationConfig({ ...newIrrigationConfig, config: {...newIrrigationConfig.config, baseIrrigation: value} })
  }

  const handleChangeStartTime = (value: string) => {
    if(!newIrrigationConfig) return;
    setNewIrrigationConfig({ 
      ...newIrrigationConfig, 
      config: {...newIrrigationConfig.config }, 
      startTime: `${newIrrigationConfig.startTime.split(' ')[1]} ${value}:00`,
    })
  }

  const handleChangeEndTime = (value: string) => {
    if(!newIrrigationConfig) return;
    setNewIrrigationConfig({ 
      ...newIrrigationConfig, 
      config: {...newIrrigationConfig.config}, 
      endTime: `${newIrrigationConfig.endTime.split(' ')[1]} ${value}:00`,
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>, currentIrrigation: IIrrigation) => {
    e.preventDefault();
    save(currentIrrigation);
  }
  
  if (!modalContainer || !irrigationSelected || !newIrrigationConfig) return;

  return ReactDOM.createPortal(
    <div className="modal-container">
      <form className="form-modal" onSubmit={(e) => handleSubmit(e, newIrrigationConfig)}>
        <div className="modal-form-title-container">
          <h3>Modificar riego</h3>
        </div>
        <div>
          <label htmlFor="editBaseIrrigation">Base de riego (min):</label>
          <input
            type="number"
            id="editBaseIrrigation"
            onChange={(e) => handleChangeBaseIrrigation(parseInt(e.target.value))} 
            value={newIrrigationConfig.config.baseIrrigation} 
            required
          />
        </div>
        <div>
          <label htmlFor="editStartTime">Hora inicial:</label>
          <input 
            type="time" 
            id="editStartTime" 
            value={newIrrigationConfig.startTime.split(' ')[1].slice(0, 5)} 
            onChange={(e) => handleChangeStartTime(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label htmlFor="editEndTime">Hora final:</label>
          <input 
            type="time" 
            id="editEndTime" 
            value={newIrrigationConfig.endTime.split(' ')[1].slice(0, 5)} 
            onChange={(e) => handleChangeEndTime(e.target.value)} 
            required 
          />
        </div>
        <div className="form-buttons-container">
          <button className='delete-btn' onClick={() => close()}>Cancelar</button>
          <button type="submit">Guardar cambios</button>
        </div>
      </form>
    </div>,
    modalContainer
  )
}

export default IrrigationModal