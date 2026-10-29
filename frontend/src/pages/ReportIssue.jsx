import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCamera,
  FaImage,
  FaRedo,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowRight,
  FaRoad,
  FaTrash,
  FaTint,
  FaDotCircle,
  FaExclamationCircle,
  FaMapMarkerAlt,
  FaLocationArrow,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { classifyImage, shrinkImage } from "../services/classifyImage";
import { apiRequest } from "../services/api";
import { useCurrentLocation } from "../hooks/useCurrentLocation";

const CATEGORY_INFO = {
  garbage: { label: "Garbage", icon: <FaTrash /> },
  pothole: { label: "Pothole", icon: <FaRoad /> },
  manhole: { label: "Manhole", icon: <FaDotCircle /> },
  water_leak: { label: "Water Leak", icon: <FaTint /> },
  unknown: { label: "Not a civic issue", icon: <FaTimesCircle /> },
};

const MAX_MB = 10;

const ReportIssue = () => {
  const { token } = useAuth();

  // choose | camera | analyzing | result | details | done
  const [step, setStep] = useState("choose");
  const [previewUrl, setPreviewUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileRef = useRef(null); // the chosen photo, kept for the final upload
  const uploadInputRef = useRef(null);
  const captureInputRef = useRef(null);

  // current precise location, only requested once the user reaches the details step
  const {
    location,
    loading: locating,
    error: locationError,
    refresh: refreshLocation,
  } = useCurrentLocation(step === "details");

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  useEffect(() => {
    if (step === "camera" && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [step]);

  useEffect(() => {
    return () => stopCamera();
  }, []);
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFile = async (file) => {
    setError("");
    setResult(null);

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Image is too large. Please choose one under ${MAX_MB} MB.`);
      return;
    }

    fileRef.current = file;
    setPreviewUrl(URL.createObjectURL(file));
    setStep("analyzing");

    try {
      const data = await classifyImage(file);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setStep("result");
    }
  };

  const onPickFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) handleFile(file);
  };

  const startCamera = async () => {
    setError("");

    if (!navigator.mediaDevices?.getUserMedia) {
      captureInputRef.current?.click();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      setStep("camera");
    } catch {
      setError(
        "Camera access was blocked or no camera was found. You can upload a photo instead."
      );
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        stopCamera();
        if (!blob) {
          setStep("choose");
          setError("Could not capture the photo. Please try again.");
          return;
        }
        handleFile(new File([blob], "capture.jpg", { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.9
    );
  };

  const cancelCamera = () => {
    stopCamera();
    setStep("choose");
  };

  const reset = () => {
    stopCamera();
    fileRef.current = null;
    setPreviewUrl("");
    setResult(null);
    setError("");
    setDescription("");
    setSubmitError("");
    setStep("choose");
  };

  const submitComplaint = async () => {
    if (!location || !fileRef.current) return;

    setSubmitError("");
    setSubmitting(true);
    try {
      const photo = await shrinkImage(fileRef.current);

      const fd = new FormData();
      fd.append("latitude", String(location.latitude));
      fd.append("longitude", String(location.longitude));
      fd.append("accuracy", String(location.accuracy ?? ""));
      fd.append("address", location.address || "");
      fd.append("city", location.city || "");
      fd.append("description", description);
      fd.append("image", photo);

      await apiRequest("/complaints", { token, method: "POST", formData: fd });
      setStep("done");
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const isValid =
    result && result.category !== "unknown" && !result.is_uncertain;
  const info = result ? CATEGORY_INFO[result.category] : null;

  const rejectMessage = () => {
    if (!result) return "";
    if (result.category === "unknown") {
      return "This does not look like a garbage, pothole, manhole or water leak photo. Please retake or upload a clearer one.";
    }
    return `We are not sure what this shows (only ${result.confidence}% confident). Please take a closer, clearer photo.`;
  };

  const lowAccuracy = location?.accuracy > 100;

  return (
    <section className="bg-brand-green/10 min-h-[calc(100vh-72px)] px-4 py-8 sm:py-10">
      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-100 p-5 sm:p-7">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {step === "details" ? "Confirm & submit" : "Report an issue"}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {step === "details"
            ? "We attach your current precise location to the complaint."
            : "Add a photo of the problem. Our AI checks what it is before you submit."}
        </p>

        <input ref={uploadInputRef} type="file" accept="image/*" className="hidden" onChange={onPickFile} />
        <input ref={captureInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onPickFile} />

        {error && step === "choose" && (
          <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm mb-4">
            <FaExclamationCircle className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: choose */}
        {step === "choose" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={startCamera}
                className="border-2 border-gray-200 rounded-2xl p-6 text-center hover:border-brand-green hover:shadow-md hover:-translate-y-0.5 transition"
              >
                <span className="mx-auto mb-3 w-14 h-14 rounded-full bg-brand-coral/10 text-brand-coral flex items-center justify-center text-2xl">
                  <FaCamera />
                </span>
                <span className="block font-semibold text-gray-900">Take photo</span>
                <span className="block text-xs text-gray-500 mt-1">Open your camera</span>
              </button>

              <button
                type="button"
                onClick={() => uploadInputRef.current?.click()}
                className="border-2 border-gray-200 rounded-2xl p-6 text-center hover:border-brand-green hover:shadow-md hover:-translate-y-0.5 transition"
              >
                <span className="mx-auto mb-3 w-14 h-14 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center text-2xl">
                  <FaImage />
                </span>
                <span className="block font-semibold text-gray-900">Upload image</span>
                <span className="block text-xs text-gray-500 mt-1">Choose from gallery</span>
              </button>
            </div>

            <p className="mt-5 text-xs text-gray-500 bg-gray-50 rounded-xl px-4 py-3">
              Tip: take a clear, close photo in good light. We can detect garbage,
              potholes, manholes and water leaks.
            </p>
          </>
        )}

        {/* STEP 2: live camera */}
        {step === "camera" && (
          <div>
            <div className="rounded-2xl overflow-hidden bg-black aspect-[4/3]">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center justify-center gap-6 mt-5">
              <button type="button" onClick={cancelCamera} className="text-sm font-medium text-gray-500 hover:text-gray-800">
                Cancel
              </button>
              <button
                type="button"
                onClick={capturePhoto}
                aria-label="Capture photo"
                className="w-16 h-16 rounded-full bg-brand-coral border-4 border-white ring-2 ring-brand-coral active:scale-95 transition"
              />
              <span className="w-12" />
            </div>
          </div>
        )}

        {/* STEP 3: analyzing */}
        {step === "analyzing" && (
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100">
            <img src={previewUrl} alt="Your photo" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-brand-green/60 flex flex-col items-center justify-center gap-3 text-white text-sm">
              <div className="w-9 h-9 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing your photo...
            </div>
          </div>
        )}

        {/* STEP 4: AI result */}
        {step === "result" && (
          <div>
            <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 mb-5">
              <img src={previewUrl} alt="Your photo" className="w-full h-full object-cover" />
            </div>

            {!result && (
              <>
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm mb-4">
                  <FaExclamationCircle className="mt-0.5 shrink-0" />
                  <span>{error || "Something went wrong."}</span>
                </div>
                <button
                  type="button"
                  onClick={reset}
                  className="w-full min-h-[48px] flex items-center justify-center gap-2 rounded-xl border border-brand-green text-brand-green font-semibold text-sm"
                >
                  <FaRedo /> Try again
                </button>
              </>
            )}

            {result && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                      isValid ? "bg-brand-green/10 text-brand-green" : "bg-red-50 text-red-600"
                    }`}
                  >
                    {isValid ? <FaCheckCircle /> : <FaTimesCircle />}
                    {isValid ? info?.label : result.category === "unknown" ? "Not a civic issue" : "Not sure"}
                  </span>
                  <span className="text-xs text-gray-500">Confidence {result.confidence}%</span>
                </div>

                <div className="space-y-2 mb-4">
                  {Object.entries(result.all_scores)
                    .sort((a, b) => b[1] - a[1])
                    .map(([name, value]) => (
                      <div key={name} className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="w-24 capitalize">{name.replace("_", " ")}</span>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-green rounded-full" style={{ width: `${value}%` }} />
                        </div>
                        <span className="w-12 text-right">{value.toFixed(1)}%</span>
                      </div>
                    ))}
                </div>

                <div
                  className={`text-sm rounded-xl px-4 py-3 mb-5 border ${
                    isValid
                      ? "bg-green-50 text-green-800 border-green-100"
                      : "bg-red-50 text-red-700 border-red-100"
                  }`}
                >
                  {isValid
                    ? `Looks like ${info?.label.toLowerCase()}. Next, we add your location and details.`
                    : rejectMessage()}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={reset}
                    className="flex-1 min-h-[48px] flex items-center justify-center gap-2 rounded-xl border border-brand-green text-brand-green font-semibold text-sm hover:bg-brand-green/5 transition"
                  >
                    <FaRedo />
                    {isValid ? "Choose different photo" : "Try another photo"}
                  </button>
                  {isValid && (
                    <button
                      type="button"
                      onClick={() => setStep("details")}
                      className="flex-1 min-h-[48px] flex items-center justify-center gap-2 rounded-xl bg-brand-green text-white font-semibold text-sm hover:bg-brand-green/90 active:scale-[0.98] transition"
                    >
                      Continue <FaArrowRight />
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* STEP 5: precise location + description + submit */}
        {step === "details" && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img src={previewUrl} alt="Your photo" className="w-16 h-16 rounded-xl object-cover" />
              <div>
                <p className="text-xs text-gray-500">Detected issue</p>
                <p className="font-semibold text-gray-900">{info?.label}</p>
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 sm:p-4 mb-4">
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-9 h-9 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center">
                  <FaMapMarkerAlt />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">
                    Your current location
                  </p>
                  <p className="mt-0.5 text-sm text-gray-700 font-semibold leading-5">
                    {locating
                      ? "Finding your exact location..."
                      : location
                      ? location.address || "Address not available, using GPS coordinates"
                      : "Location not detected yet"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={refreshLocation}
                  disabled={locating}
                  aria-label="Refresh location"
                  className="shrink-0 w-9 h-9 rounded-lg text-brand-green bg-brand-green/5 hover:bg-brand-green/10 flex items-center justify-center disabled:opacity-50"
                >
                  <FaLocationArrow className={`text-xs ${locating ? "animate-spin" : ""}`} />
                </button>
              </div>

              {location && (
                <div className="mt-3">
                  <code className="block bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm font-mono font-semibold text-gray-700">
                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </code>
                  <div className="mt-2 flex justify-between text-xs text-gray-400">
                    <span>GPS accuracy</span>
                    <span className="font-semibold text-gray-600">
                      ±{Math.round(location.accuracy)} meters
                    </span>
                  </div>
                </div>
              )}

              {lowAccuracy && (
                <p className="mt-2 text-xs text-amber-600">
                  GPS accuracy is low. Move to an open area and tap refresh for a more precise location.
                </p>
              )}
            </div>

            {locationError && (
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm mb-4">
                <FaExclamationCircle className="mt-0.5 shrink-0" />
                <span>{locationError}</span>
              </div>
            )}

            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="e.g. Deep pothole near the bus stop"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/15 transition mb-4"
            />

            {submitError && (
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm mb-4">
                <FaExclamationCircle className="mt-0.5 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setStep("result")}
                disabled={submitting}
                className="sm:w-32 min-h-[48px] rounded-xl border border-gray-300 text-gray-600 font-semibold text-sm disabled:opacity-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={submitComplaint}
                disabled={!location || locating || submitting}
                className="flex-1 min-h-[48px] rounded-xl bg-brand-green text-white font-semibold text-sm hover:bg-brand-green/90 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit complaint"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: done */}
        {step === "done" && (
          <div className="text-center py-4">
            <span className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-3xl">
              <FaCheckCircle />
            </span>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Complaint submitted</h2>
            <p className="text-sm text-gray-500 mb-6">
              Your report with the photo and exact location has reached the administration.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={reset}
                className="flex-1 min-h-[48px] rounded-xl border border-brand-green text-brand-green font-semibold text-sm"
              >
                Report another issue
              </button>
              <Link
                to="/"
                className="flex-1 min-h-[48px] flex items-center justify-center rounded-xl bg-brand-green text-white font-semibold text-sm"
              >
                Go to home
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReportIssue;