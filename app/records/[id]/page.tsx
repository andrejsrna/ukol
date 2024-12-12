"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

interface Record {
  id: number;
  name: string;
  age: number;
  fileUrl: string;
}

export default function RecordDetail() {
  const router = useRouter();
  const params = useParams();
  const [record, setRecord] = useState<Record | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
  });

  const fetchRecord = async () => {
    const response = await fetch(`/api/records/${params.id}`);
    const data = await response.json();
    setRecord(data);
    setFormData({ name: data.name, age: String(data.age) });
  };

  useEffect(() => {
    if (params.id) {
      fetchRecord();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/records/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          age: parseInt(formData.age),
        }),
      });

      if (response.ok) {
        setIsEditing(false);
        fetchRecord();
      }
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };

  const handleDelete = async () => {
    if (confirm("Naozaj chcete vymazať tento záznam?")) {
      try {
        const response = await fetch(`/api/records/${params.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          router.push("/");
        }
      } catch (error) {
        console.error("Error deleting record:", error);
      }
    }
  };

  if (!record) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <button
        onClick={() => router.push("/")}
        className="mb-8 text-indigo-600 hover:text-indigo-800 transition-colors duration-200 flex items-center gap-2 font-medium"
      >
        <span className="text-xl">←</span> Späť na zoznam
      </button>

      {isEditing ? (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 transform transition-all duration-300">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Upraviť záznam</h2>
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meno:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vek:</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
              >
                Uložiť zmeny
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
              >
                Zrušiť
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-indigo-600 px-6 py-4">
              <h1 className="text-2xl font-bold text-white">Detail záznamu</h1>
            </div>
            
            <div className="p-6">
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 font-medium min-w-[80px]">Meno:</span>
                  <span className="text-gray-900 font-semibold">{record.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 font-medium min-w-[80px]">Vek:</span>
                  <span className="text-gray-900 font-semibold">{record.age}</span>
                </div>
              </div>

              <a 
                href={record.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors duration-200 mb-6"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Zobraziť súbor
              </a>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
                >
                  Upraviť
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-100 text-red-600 px-6 py-3 rounded-lg hover:bg-red-200 transition-colors duration-200 font-medium"
                >
                  Vymazať
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}