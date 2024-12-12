// app/components/UploadForm.tsx
"use client";
import { useState } from "react";
import { FiUpload, FiUser, FiCalendar, FiFile, FiArrowRight, FiArrowLeft, FiCheck } from "react-icons/fi";

interface UploadFormProps {
  onUploadSuccess: () => void;
}

export default function UploadForm({ onUploadSuccess }: UploadFormProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("age", age);
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await fetch("/api/records", {
        method: "POST",
        body: formData,
        cache: 'no-store'
      });

      if (response.ok) {
        setName("");
        setAge("");
        setFile(null);
        setStep(1);
        onUploadSuccess();
      }
    } catch (error) {
      console.error("Error uploading record:", error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const nextStep = () => {
    if ((step === 1 && name) || (step === 2 && age) || (step === 3 && file)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= num
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {step > num ? <FiCheck /> : num}
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-2xl font-bold text-center text-gray-800">Osobné údaje</h2>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Zadajte meno"
                required
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-2xl font-bold text-center text-gray-800">Vek</h2>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Zadajte vek"
                required
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-2xl font-bold text-center text-gray-800">Nahrať súbor</h2>
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 transition duration-200 ${
                isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center space-y-3">
                <FiFile className="h-10 w-10 text-gray-400" />
                <p className="text-gray-600 text-center">
                  Pretiahnite súbor sem alebo
                  <label className="ml-1 text-blue-500 hover:text-blue-600 cursor-pointer">
                    <span>vyberte zo zariadenia</span>
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="hidden"
                      required
                    />
                  </label>
                </p>
                {file && (
                  <p className="text-sm text-gray-500">
                    Vybraný súbor: {file.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200"
            >
              <FiArrowLeft className="h-5 w-5" />
              <span>Späť</span>
            </button>
          )}
          
          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 ml-auto"
            >
              <span>Ďalej</span>
              <FiArrowRight className="h-5 w-5" />
            </button>
          ) : (
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200 ml-auto"
            >
              <FiUpload className="h-5 w-5" />
              <span>Dokončiť</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}