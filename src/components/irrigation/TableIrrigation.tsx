import React from 'react'

import useTableIrrigation from '../../hooks/useTableIrrigation'
import IrrigationModal from './IrrigationModal';

const TableIrrigation = () => {

  const {
    filteredIrrigations,
    totalItems,
    page,
    totalPages,
    incrementPage,
    decrementPage,
    irrigationSelected,
    setIrrigationSelected,
    editIrrigation,
    deleteIrrigation
  } = useTableIrrigation();

  return (
    <React.Fragment>
      <IrrigationModal
        irrigationSelected={irrigationSelected}
        close={() => setIrrigationSelected(null)}
        save={editIrrigation}
      />
      <h2>Calendario de riegos</h2>
      <table className="irrigation-table">
        <thead>
          <tr>
            <th>Tiempo de riego</th>
            <th>Fecha de inicio</th>
            <th>Fecha de fin</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody id="irrigationTableBody">
          {
            filteredIrrigations.map(currentIrrigation => (
              <tr key={`[irrigation]${currentIrrigation._id}`}>
                <td>{currentIrrigation.config.baseIrrigation}</td>
                <td>{currentIrrigation.startTime}</td>
                <td>{currentIrrigation.endTime}</td>
                <td className="table-irrigation-buttons">
                  {
                    new Date(currentIrrigation.startTime).getTime() >= new Date().getTime()
                      ? (
                        <>
                          <button className="edit-btn" data-id={currentIrrigation._id} onClick={() => setIrrigationSelected(currentIrrigation)}>Editar</button>
                          <button className="delete-btn" data-id={currentIrrigation._id} onClick={() => deleteIrrigation(currentIrrigation)}>Eliminar</button>
                        </>
                      ) : (
                        <>
                          <button className="accept-btn hidden" data-id={currentIrrigation._id}>Aceptar</button>
                          <button className="edit-btn hidden" data-id={currentIrrigation._id}>Editar</button>
                          <button className="delete-btn hidden" data-id={currentIrrigation._id}>Eliminar</button>
                        </>
                      )
                  }
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
      <div className="pagination-container">
        <div className="total-items">{(page * 5) + 1}-{((page + 1) * 5)} de {totalItems}</div>
        <div className="arrow-container">
          { page !== (page * 5) && <div className="arrow-button" onClick={decrementPage}>{'<'}</div>}
          <div><b>{page + 1}</b> / {totalPages}</div>
          { (page + 1) !== totalPages && <div className="arrow-button" onClick={incrementPage}>{'>'}</div>}
        </div>
      </div>
    </React.Fragment>
  )
}

export default TableIrrigation