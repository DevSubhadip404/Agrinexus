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

const STORAGE_KEY = "agrinexus_farms"

const defaultFarms: Farm[] = [
  {
    farm_id: "farm-001",
    crop: "rice",
    area_acres: 2.5,
    latitude: 17.4,
    longitude: 78.5,

    soil: {
      ph: 6.4,
      nitrogen: "Low",
      phosphorus: "Medium",
      potassium: "Medium",
      moisture: "Medium",
    },
  },

  {
    farm_id: "farm-002",
    crop: "tomato",
    area_acres: 1.8,
    latitude: 17.42,
    longitude: 78.48,

    soil: {
      ph: 6.8,
      nitrogen: "Medium",
      phosphorus: "High",
      potassium: "Medium",
      moisture: "Low",
    },
  },
]

export function getFarms(): Farm[] {
  const saved = localStorage.getItem(STORAGE_KEY)

  if (!saved) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(defaultFarms)
    )

    return defaultFarms
  }

  const farms: Farm[] = JSON.parse(saved)

  return farms.map((farm) => ({
    ...farm,

    soil: farm.soil ?? {
      ph: 6.5,
      nitrogen: "Medium",
      phosphorus: "Medium",
      potassium: "Medium",
      moisture: "Medium",
    },
  }))
}

export function getFarmById(farmId: string): Farm | undefined {
  const farms = getFarms()

  return farms.find(
    (farm) => farm.farm_id === farmId
  )
}

export function createFarm(data: {
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
}): Farm {
  const farms = getFarms()

  const newFarm: Farm = {
    farm_id: crypto.randomUUID(),
    crop: data.crop,
    area_acres: data.area_acres,
    latitude: data.latitude,
    longitude: data.longitude,
    soil: data.soil,
  }

  const updatedFarms = [
    ...farms,
    newFarm,
  ]

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedFarms)
  )

  return newFarm
}