import { useEffect, useState } from "react"

import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../redux/store";
import { IIrrigation } from "../interfaces/Irrigation";
import { DELETEData, POSTData, PUTData } from "../services/WebServices";
import { toast } from "react-toastify";
import { setIrrigations } from "../redux/reducer/IrrigationReducer";

const useTableIrrigation = () => {

  const { currentConfig } = useSelector((state: IRootState) => state.parcelConfig)
  const { irrigations } = useSelector((state: IRootState) => state.irrigation)

  const dispatch = useDispatch();

  const [sortedIrrigations, setSortedIrrigations] = useState<IIrrigation[]>([]);
  const [filteredIrrigations, setFilteredIrrigations] = useState<IIrrigation[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [irrigationSelected, setIrrigationSelected] = useState<IIrrigation | null>(null);

  const sortIrrigations = () => {
    return [...irrigations].sort((a, b) => {
      const aTime = new Date(a.startTime).getTime();
      const bTime = new Date(b.startTime).getTime();
      return bTime - aTime
    })
  }

  const incrementPage = () => page < totalPages && setPage(page + 1);
  const decrementPage = () => page > 0 && setPage(page - 1);

  const editIrrigation = async(currentIrrigation: IIrrigation) => {
    try{
      if(!currentConfig) return;
      const result = await PUTData(`/irrigation/${currentIrrigation._id}`, { irrigation: currentIrrigation, configId: currentConfig._id });
      if(!result.data) throw new Error("Cannot update irrigation")
      const updatedIrrigation = result.data;
      dispatch(setIrrigations(irrigations.map(currentIrrigation => currentIrrigation._id === updatedIrrigation._id ? updatedIrrigation : currentIrrigation )));
      setIrrigationSelected(null);
      toast('Riego modificado correctamente')
    }catch(err){
      console.error(err);
      toast('El riego no se pudo actualizar')
    }
  }

  const deleteIrrigation = async(currentIrrigation: IIrrigation) => {
    try{
      if(!currentConfig) return;
      await DELETEData(`/irrigation/${currentIrrigation._id}`, { precimedId: currentIrrigation.precimedId });
      toast('Riego eliminado correctamente')
    }catch(err){
      console.error(err);
      toast('El riego no se pudo eliminar')
    }
  }

  useEffect(() => {
    setTotalPages(parseInt((irrigations.length / 5).toString()) + ( irrigations.length % 5 === 0 ? 0 : 1));
    setSortedIrrigations(sortIrrigations())
  }, [irrigations])

  useEffect(() => {
    const newFilteredIrrigations = [...sortedIrrigations].slice(page * 5, (page + 1) * 5)
    setFilteredIrrigations(newFilteredIrrigations)
  }, [sortedIrrigations, page])

  return {
    filteredIrrigations,
    totalItems: irrigations.length,
    page,
    totalPages,
    incrementPage,
    decrementPage,
    irrigationSelected,
    setIrrigationSelected,
    editIrrigation,
    deleteIrrigation
  }
}

export default useTableIrrigation