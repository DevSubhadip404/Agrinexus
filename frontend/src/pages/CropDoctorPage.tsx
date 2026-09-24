import { useState } from "react"

import Navbar from "../components/Navbar"
import {
  diagnoseCrop,
  type CropDiagnosis,
} from "../services/cropDoctorService"

function CropDoctorPage() {
  const [crop, setCrop] = useState("Rice")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")

  const [diagnosis, setDiagnosis] =
    useState<CropDiagnosis | null>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setDiagnosis(null)
    setError("")
  }

  async function handleDiagnose() {
    if (!imageFile) {
      return
    }

    setLoading(true)
    setError("")
    setDiagnosis(null)

    try {
      const result = await diagnoseCrop(
        crop,
        imageFile
      )

      setDiagnosis(result.diagnosis)
    } catch (err) {
      console.error(err)

      setError(
        "Crop analysis is temporarily unavailable. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold tracking-widest text-green-700">
            AGRINEXUS
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Crop Doctor
          </h1>

          <p className="mt-2 max-w-2xl text-gray-600">
            Upload a clear crop image for AI-assisted visual
            diagnosis.
          </p>

          <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Crop
              </label>

              <select
                value={crop}
                onChange={(event) => {
                  setCrop(event.target.value)
                  setDiagnosis(null)
                }}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3"
              >
                <option value="Rice">
                  Rice
                </option>

                <option value="Tomato">
                  Tomato
                </option>

                <option value="Maize">
                  Maize
                </option>

                <option value="Soybean">
                  Soybean
                </option>
              </select>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700">
                Crop Image
              </label>

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                className="mt-3 block w-full rounded-xl border border-gray-300 p-3"
              />
            </div>

            {previewUrl && (
              <div className="mt-6">
                <img
                  src={previewUrl}
                  alt="Selected crop"
                  className="max-h-80 w-full rounded-2xl bg-gray-100 object-contain"
                />
              </div>
            )}

            <button
              type="button"
              onClick={handleDiagnose}
              disabled={!imageFile || loading}
              className="mt-6 w-full rounded-xl bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading
                ? "Analyzing Crop..."
                : "Diagnose Crop"}
            </button>

            {loading && (
              <p className="mt-4 text-center text-sm text-gray-500">
                Gemini is examining the crop image. This may take a few seconds.
              </p>
            )}

            {error && (
              <p className="mt-5 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">
                {error}
              </p>
            )}
          </div>

          {diagnosis && (
            <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold tracking-widest text-green-700">
                    GEMINI CROP DIAGNOSIS
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    {diagnosis.disease}
                  </h2>
                </div>

                {diagnosis.uncertain && (
                  <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-800">
                    Uncertain result
                  </span>
                )}
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-green-50 p-5">
                  <p className="text-sm text-gray-500">
                    Confidence
                  </p>

                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {diagnosis.confidence}%
                  </p>
                </div>

                <div className="rounded-xl bg-yellow-50 p-5">
                  <p className="text-sm text-gray-500">
                    Severity
                  </p>

                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {diagnosis.severity}
                  </p>
                </div>
              </div>

              <div className="mt-7">
                <h3 className="font-semibold text-gray-900">
                  Observed Symptoms
                </h3>

                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
                  {diagnosis.symptoms.map((symptom) => (
                    <li key={symptom}>
                      {symptom}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-7">
                <h3 className="font-semibold text-gray-900">
                  Recommended Actions
                </h3>

                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
                  {diagnosis.actions.map((action) => (
                    <li key={action}>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-7 rounded-xl bg-gray-50 p-4">
                <p className="text-xs leading-5 text-gray-500">
                  AI-assisted visual assessment only. Confirm uncertain
                  or severe cases with a qualified local agricultural
                  expert before taking major treatment decisions.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CropDoctorPage