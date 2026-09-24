export type Farm = {
  farm_id: string
  crop: string
  area_acres: number
  latitude: number
  longitude: number

  soil: {
    ph: number
    nitrogen: string
    phosphorus: string
    potassium: string
    moisture: string
  }
}