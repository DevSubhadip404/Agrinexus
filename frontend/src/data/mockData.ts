export const mockFarms = [
  {
    farm_id: "farm-001",
    crop: "rice",
    area_acres: 2.5,
    latitude: 17.4,
    longitude: 78.5,
  },
  {
    farm_id: "farm-002",
    crop: "tomato",
    area_acres: 1.8,
    latitude: 17.42,
    longitude: 78.48,
  },
]

export const mockAnalysis = {
  "farm-001": {
    vegetationHealth: 72,
    ndvi: 0.68,
    rainProbability: 68,
    temperature: 31,
    humidity: 72,
    diseaseRisk: "Medium",
    soilStatus: "Low Nitrogen",

    recommendations: [
      {
        type: "Irrigation",
        message:
          "Delay irrigation for 24 hours because rainfall is likely.",
      },
      {
        type: "Soil Health",
        message:
          "Nitrogen levels are low. Consider nitrogen-fixing crops in the next rotation.",
      },
      {
        type: "Regenerative Practice",
        message:
          "Introduce legume rotation to improve long-term soil fertility.",
      },
    ],
  },

  "farm-002": {
    vegetationHealth: 84,
    ndvi: 0.79,
    rainProbability: 32,
    temperature: 29,
    humidity: 64,
    diseaseRisk: "Low",
    soilStatus: "Healthy",

    recommendations: [
      {
        type: "Irrigation",
        message:
          "Light irrigation may be required because rainfall probability is low.",
      },
      {
        type: "Crop Health",
        message:
          "Vegetation health is strong. Continue monitoring for early signs of stress.",
      },
      {
        type: "Regenerative Practice",
        message:
          "Maintain residue cover to preserve soil moisture.",
      },
    ],
  },
}