import { useState } from "react"

import Navbar from "../components/Navbar"

function CropDoctorPage() {
  const [crop, setCrop] = useState("rice")
  const [fileName, setFileName] = useState("")
  const [previewUrl, setPreviewUrl] = useState("")
  const [diagnosed, setDiagnosed] = useState(false)

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    const newPreviewUrl = URL.createObjectURL(file)

    setFileName(file.name)
    setPreviewUrl(newPreviewUrl)
    setDiagnosed(false)
  }

  function handleDiagnose() {
    if (!fileName) {
      return
    }

    setDiagnosed(true)
  }

  const diagnosis =
    crop === "rice"
      ? {
          disease: "Possible Brown Spot",
          confidence: 84,
          severity: "Medium",
          symptoms: [
            "Brown circular lesions",
            "Leaf discoloration",
          ],
          actions: [
            "Inspect nearby rice plants for similar symptoms.",
            "Remove severely affected leaves where practical.",
            "Avoid excessive nitrogen application.",
            "Seek expert advice if symptoms continue spreading.",
          ],
        }
      : {
          disease: "Possible Early Blight",
          confidence: 81,
          severity: "Medium",
          symptoms: [
            "Dark brown leaf spots",
            "Concentric ring patterns",
          ],
          actions: [
            "Inspect lower tomato leaves carefully.",
            "Remove heavily affected plant material.",
            "Avoid wetting foliage during irrigation.",
            "Seek expert advice if infection continues spreading.",
          ],
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
            Upload a clear photo of an affected crop leaf for AI-assisted
            disease diagnosis.
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
                  setDiagnosed(false)
                }}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3"
              >
                <option value="rice">
                  Rice
                </option>

                <option value="tomato">
                  Tomato
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
                <p className="mb-3 text-sm font-medium text-gray-600">
                  Selected: {fileName}
                </p>

                <img
                  src={previewUrl}
                  alt="Selected crop leaf"
                  className="max-h-80 w-full rounded-2xl object-contain bg-gray-100"
                />
              </div>
            )}

            <button
              type="button"
              onClick={handleDiagnose}
              disabled={!fileName}
              className="mt-6 w-full rounded-xl bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Diagnose Crop
            </button>
          </div>

          {diagnosed && (
            <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold tracking-widest text-green-700">
                AI DIAGNOSIS
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                {diagnosis.disease}
              </h2>

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
                  This is currently a prototype diagnosis using mock data.
                  The final version will use multimodal AI and return a
                  confidence-aware result from the backend.
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