import {
  useEffect,
  useState,
  type ChangeEvent,
} from "react"

import Navbar from "../components/Navbar"

import {
  diagnoseCrop,
  type CropDiagnosis,
} from "../services/cropDoctorService"


const suggestedCrops = [
  "Rice",
  "Wheat",
  "Maize",
  "Tomato",
  "Soybean",
  "Cotton",
  "Potato",
  "Sugarcane",
  "Groundnut",
  "Chickpea",
  "Mustard",
  "Coffee",
]


function CropDoctorPage() {
  const [crop, setCrop] = useState("Rice")

  const [imageFile, setImageFile] =
    useState<File | null>(null)

  const [previewUrl, setPreviewUrl] =
    useState("")

  const [diagnosis, setDiagnosis] =
    useState<CropDiagnosis | null>(null)

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState("")


  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])


  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0]

    if (!file) {
      return
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setImageFile(file)

    setPreviewUrl(
      URL.createObjectURL(file)
    )

    setDiagnosis(null)
    setError("")
  }


  async function handleDiagnose() {
    const cropName = crop.trim()

    if (!imageFile || !cropName) {
      return
    }

    setLoading(true)
    setError("")
    setDiagnosis(null)

    try {
      const result =
        await diagnoseCrop(
          cropName,
          imageFile
        )

      setDiagnosis(
        result.diagnosis
      )
    } catch (err) {
      console.error(err)

      setError(
        "Crop analysis is temporarily unavailable. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }


  const displayedSeverity =
    diagnosis?.uncertain
      ? "Not assessed"
      : diagnosis?.severity


  return (
    <div className="min-h-screen bg-[#f6f8f4]">
      <Navbar />

      <main className="px-6 py-10">
        <div className="mx-auto max-w-5xl">

          <section className="overflow-hidden rounded-3xl border border-green-100 bg-gradient-to-br from-white via-green-50/50 to-emerald-50 shadow-sm">
            <div className="p-8 md:p-10">
              <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

                <div className="max-w-2xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-xs font-bold tracking-[0.24em] text-green-700">
                      AGRINEXUS VISION
                    </p>

                    <span className="rounded-full border border-green-200 bg-white px-3 py-1 text-xs font-semibold text-green-700">
                      Gemini-powered
                    </span>
                  </div>

                  <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                    Crop Doctor
                  </h1>

                  <p className="mt-3 max-w-xl leading-7 text-gray-600">
                    Upload a clear crop image for an AI-assisted visual
                    assessment of visible symptoms and possible crop issues.
                  </p>
                </div>


                <div className="hidden h-24 w-24 items-center justify-center rounded-3xl bg-green-900 text-green-100 lg:flex">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="h-11 w-11"
                  >
                    <path d="M12 21V10" />

                    <path d="M12 13c-4 0-7-2-7-6 4 0 7 2 7 6z" />

                    <path d="M12 10c0-4 3-6 7-6 0 4-3 6-7 6z" />

                    <circle
                      cx="17.5"
                      cy="16.5"
                      r="3.5"
                    />

                    <path d="M20 19l2 2" />
                  </svg>
                </div>
              </div>
            </div>
          </section>


          <section className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">

            <div className="rounded-3xl border border-gray-100 bg-white p-7 shadow-sm">

              <p className="text-xs font-bold tracking-[0.2em] text-green-700">
                STEP 01
              </p>

              <h2 className="mt-2 text-xl font-bold text-gray-900">
                Identify the crop
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Type the crop you expect to appear in the uploaded image.
                You are not limited to the suggested crops.
              </p>


              <label
                htmlFor="crop-name"
                className="mt-6 block text-sm font-semibold text-gray-700"
              >
                Crop name
              </label>

              <input
                id="crop-name"
                type="text"
                list="crop-suggestions"
                value={crop}
                onChange={(event) => {
                  setCrop(
                    event.target.value
                  )

                  setDiagnosis(null)
                  setError("")
                }}
                placeholder="e.g. Rice, Wheat, Cotton"
                autoComplete="off"
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-medium text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
              />

              <datalist id="crop-suggestions">
                {suggestedCrops.map(
                  (cropName) => (
                    <option
                      key={cropName}
                      value={cropName}
                    />
                  )
                )}
              </datalist>


              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Common crops
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {suggestedCrops
                    .slice(0, 8)
                    .map(
                      (cropName) => (
                        <button
                          key={cropName}
                          type="button"
                          onClick={() => {
                            setCrop(
                              cropName
                            )

                            setDiagnosis(
                              null
                            )

                            setError("")
                          }}
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                            crop.toLowerCase() ===
                            cropName.toLowerCase()
                              ? "border-green-700 bg-green-700 text-white"
                              : "border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:bg-green-50 hover:text-green-700"
                          }`}
                        >
                          {cropName}
                        </button>
                      )
                    )}
                </div>
              </div>


              <div className="mt-6 rounded-2xl bg-green-50 p-4">
                <div className="flex gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-4 w-4"
                    >
                      <path d="M12 8v4" />

                      <path d="M12 16h.01" />

                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                      />
                    </svg>
                  </div>

                  <p className="text-xs leading-5 text-green-800">
                    The crop name provides context to Gemini. If the uploaded
                    image does not appear to match the stated crop, Crop Doctor
                    can return an uncertain assessment rather than forcing a
                    diagnosis.
                  </p>
                </div>
              </div>
            </div>


            <div className="rounded-3xl border border-gray-100 bg-white p-7 shadow-sm">

              <p className="text-xs font-bold tracking-[0.2em] text-green-700">
                STEP 02
              </p>

              <h2 className="mt-2 text-xl font-bold text-gray-900">
                Upload crop image
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Use a clear image where leaves, stems, spots, or visible
                symptoms can be inspected.
              </p>


              <input
                id="crop-image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />


              {!previewUrl ? (
                <label
                  htmlFor="crop-image"
                  className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center transition hover:border-green-400 hover:bg-green-50/50"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-7 w-7"
                    >
                      <path d="M12 16V4" />

                      <path d="M7 9l5-5 5 5" />

                      <path d="M5 14v5h14v-5" />
                    </svg>
                  </div>

                  <p className="mt-4 font-semibold text-gray-900">
                    Choose a crop image
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    JPEG, PNG, or WebP
                  </p>
                </label>
              ) : (
                <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200">

                  <div className="bg-gray-100 p-3">
                    <img
                      src={previewUrl}
                      alt="Selected crop"
                      className="max-h-96 w-full rounded-xl object-contain"
                    />
                  </div>

                  <div className="flex flex-col gap-3 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {imageFile?.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Crop context:{" "}
                        {crop.trim() ||
                          "Not provided"}
                      </p>
                    </div>

                    <label
                      htmlFor="crop-image"
                      className="cursor-pointer text-sm font-semibold text-green-700 hover:text-green-800"
                    >
                      Change image
                    </label>
                  </div>
                </div>
              )}


              <button
                type="button"
                onClick={handleDiagnose}
                disabled={
                  !imageFile ||
                  !crop.trim() ||
                  loading
                }
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? (
                  <>
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-200" />

                    Analyzing Crop...
                  </>
                ) : (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                    >
                      <path d="M12 3l1.8 4.7L19 9.5l-5.2 1.8L12 16l-1.8-4.7L5 9.5l5.2-1.8L12 3z" />

                      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" />
                    </svg>

                    Diagnose Crop
                  </>
                )}
              </button>


              {!crop.trim() && (
                <p className="mt-3 text-center text-xs font-medium text-amber-600">
                  Enter a crop name before starting the diagnosis.
                </p>
              )}


              {loading && (
                <p className="mt-4 text-center text-xs leading-5 text-gray-400">
                  Gemini is examining the image for visible crop
                  characteristics and symptoms. This may take a few seconds.
                </p>
              )}


              {error && (
                <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4">
                  <p className="text-sm font-semibold text-red-700">
                    Analysis unavailable
                  </p>

                  <p className="mt-1 text-sm text-red-600">
                    {error}
                  </p>
                </div>
              )}
            </div>
          </section>


          {diagnosis && (
            <section className="mt-8 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">

              <div
                className={`border-b p-8 ${
                  diagnosis.uncertain
                    ? "border-amber-100 bg-amber-50/60"
                    : "border-green-100 bg-green-50/60"
                }`}
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                  <div>
                    <p
                      className={`text-xs font-bold tracking-[0.22em] ${
                        diagnosis.uncertain
                          ? "text-amber-700"
                          : "text-green-700"
                      }`}
                    >
                      GEMINI VISUAL ASSESSMENT
                    </p>

                    <h2 className="mt-3 text-3xl font-bold text-gray-900">
                      {diagnosis.disease}
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                      Crop context:{" "}
                      <span className="font-semibold text-gray-700">
                        {crop.trim()}
                      </span>
                    </p>
                  </div>


                  <span
                    className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${
                      diagnosis.uncertain
                        ? "bg-amber-100 text-amber-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {diagnosis.uncertain
                      ? "Uncertain assessment"
                      : "Assessment generated"}
                  </span>
                </div>


                {diagnosis.uncertain && (
                  <div className="mt-6 rounded-2xl border border-amber-200 bg-white/70 p-5">
                    <div className="flex gap-3">

                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 font-bold text-amber-700">
                        !
                      </div>

                      <div>
                        <p className="font-semibold text-amber-900">
                          Insufficient confidence for a firm diagnosis
                        </p>

                        <p className="mt-1 text-sm leading-6 text-amber-800">
                          The image may not clearly match the stated crop,
                          may not show enough diagnostic detail, or may not
                          provide enough visual evidence for a reliable
                          assessment.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>


              <div className="p-8">

                <div className="grid gap-4 sm:grid-cols-2">

                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      AI Confidence
                    </p>

                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      {diagnosis.confidence}%
                    </p>

                    <p className="mt-2 text-xs leading-5 text-gray-400">
                      Model-reported confidence, not a calibrated probability.
                    </p>
                  </div>


                  <div
                    className={`rounded-2xl border p-5 ${
                      diagnosis.uncertain
                        ? "border-gray-100 bg-gray-50"
                        : "border-amber-100 bg-amber-50/60"
                    }`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Severity
                    </p>

                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      {displayedSeverity}
                    </p>

                    <p className="mt-2 text-xs leading-5 text-gray-400">
                      {diagnosis.uncertain
                        ? "Severity is not reported when the visual assessment is uncertain."
                        : "Visual severity estimate from the submitted image."}
                    </p>
                  </div>
                </div>


                <div className="mt-8 grid gap-6 lg:grid-cols-2">

                  <div className="rounded-2xl border border-gray-100 p-6">

                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className="h-5 w-5"
                        >
                          <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z" />

                          <circle
                            cx="12"
                            cy="12"
                            r="2"
                          />
                        </svg>
                      </div>

                      <h3 className="font-bold text-gray-900">
                        Observed Symptoms
                      </h3>
                    </div>


                    {diagnosis.symptoms.length > 0 ? (
                      <div className="mt-5 space-y-3">
                        {diagnosis.symptoms.map(
                          (
                            symptom,
                            index
                          ) => (
                            <div
                              key={`${symptom}-${index}`}
                              className="flex gap-3"
                            >
                              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[11px] font-bold text-blue-700">
                                {index + 1}
                              </span>

                              <p className="text-sm leading-6 text-gray-700">
                                {symptom}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="mt-5 text-sm text-gray-500">
                        No specific symptoms were reported.
                      </p>
                    )}
                  </div>


                  <div className="rounded-2xl border border-green-100 bg-green-50/40 p-6">

                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-100 text-green-700">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className="h-5 w-5"
                        >
                          <path d="M5 12l4 4L19 6" />
                        </svg>
                      </div>

                      <h3 className="font-bold text-gray-900">
                        Recommended Actions
                      </h3>
                    </div>


                    {diagnosis.actions.length > 0 ? (
                      <div className="mt-5 space-y-3">
                        {diagnosis.actions.map(
                          (
                            action,
                            index
                          ) => (
                            <div
                              key={`${action}-${index}`}
                              className="flex gap-3"
                            >
                              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-[11px] font-bold text-green-700">
                                {index + 1}
                              </span>

                              <p className="text-sm leading-6 text-gray-700">
                                {action}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="mt-5 text-sm text-gray-500">
                        No specific actions were generated.
                      </p>
                    )}
                  </div>
                </div>


                <div className="mt-8 rounded-2xl bg-gray-950 p-5 text-gray-200">
                  <div className="flex gap-3">

                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-800 text-xs font-bold text-gray-300">
                      i
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        AI-assisted assessment
                      </p>

                      <p className="mt-1 text-xs leading-5 text-gray-400">
                        Crop Doctor evaluates visible characteristics in the
                        submitted image. It does not replace laboratory testing,
                        field inspection, or advice from a qualified local
                        agricultural professional. Confirm uncertain or severe
                        cases before making major treatment decisions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}


export default CropDoctorPage