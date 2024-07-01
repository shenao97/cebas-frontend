import { IConfig } from "./Config";

export interface IIrrigation {
  _id: string,
  parcelName: string,
  startTime: string,
  endTime: string,
  config: IConfig,
  isPending: boolean,
  id: number,
  precimedId?: number
}

export interface IIrrigationConfig {
  bRoots: number,
  aRoots: number,
  bDrain: number,
  aDrain: number,
}