import { API_BASE_URL } from "../config"

export type CropDiagnosis = {
  disease: string
  confidence: number
  severity: "Low" | "Medium" | "High"
  symptoms: string[]
  actions: string[]
  uncertain: boolean
}

export type CropDoctorResponse = {
  crop: string
  filename: string
  diagnosis: CropDiagnosis
  model: string
}

export async function diagnoseCrop(
  crop: string,
  image: File
): Promise<CropDoctorResponse> {
  const formData = new FormData()

  formData.append("crop", crop)
  formData.append("image", image)

  const response = await fetch(
    `${API_BASE_URL}/api/crop-doctor/diagnose`,
    {
      method: "POST",
      body: formData,
    }
  )

  if (!response.ok) {
    throw new Error("Could not analyze crop image")
  }

  return response.json()
}