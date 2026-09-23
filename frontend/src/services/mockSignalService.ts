export type FieldSignals = {
  satellite: {
    ndvi: number
    ndmi: number
    vegetationHealth: number
  }

  weather: {
    temperature: number
    humidity: number
    rainProbability: number
    rainfallForecastMm: number
  }
}

export function getFieldSignals(
  latitude: number,
  longitude: number
): FieldSignals {
  const coordinateSeed =
    Math.abs(Math.round((latitude + longitude) * 100))

  const ndvi =
    0.55 + (coordinateSeed % 25) / 100

  const ndmi =
    0.3 + (coordinateSeed % 20) / 100

  const vegetationHealth =
    Math.round(ndvi * 100)

  const temperature =
    27 + (coordinateSeed % 6)

  const humidity =
    58 + (coordinateSeed % 20)

  const rainProbability =
    35 + (coordinateSeed % 50)

  const rainfallForecastMm =
    Math.round((rainProbability / 100) * 18)

  return {
    satellite: {
      ndvi: Number(ndvi.toFixed(2)),
      ndmi: Number(ndmi.toFixed(2)),
      vegetationHealth,
    },

    weather: {
      temperature,
      humidity,
      rainProbability,
      rainfallForecastMm,
    },
  }
}