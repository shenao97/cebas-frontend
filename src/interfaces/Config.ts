export interface IConfig {
  rootsL: number, 
  drainL: number, 
  aRootsTimelapse: number, 
  aDrainTimelapse: number, 
  percentageIncrement: number,
  rootsLThreshold: number, 
  drainLThreshold: number, 
  baseIrrigation: number, 
  minIrrigationTimeMin: number,
  maxIrrigationTimeMin: number, 
  startTime1: string,
  startTime2: string,
  startTime3: string,
  initialDate: string
}

export interface IParcelConfig {
  _id: string,
  parcelName: string,
  configFilled: boolean,
  config: IConfig
}