"use client";
import { useState, useEffect } from "react";
import UploadForm from "./components/UploadForm";
import Link from "next/link";
import { FiFile, FiUser, FiCalendar, FiChevronRight } from "react-icons/fi";

interface Record {
  id: number;
  name: string;
  age: number;
  fileUrl: string;
}

export default function Home() {
  const [records, setRecords] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/records');
      if (!response.ok) {
        throw new Error('Failed to fetch records');
      }
      const data = await response.json();
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching records:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <div className="text-red-600 font-medium">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Záznamy</h1>
        <p className="text-gray-600 mb-8">Správa a organizácia vašich dokumentov</p>
        
        <UploadForm onUploadSuccess={fetchRecords} />

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Zoznam záznamov</h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : records.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">📄</div>
              <p className="text-gray-600 text-lg">Žiadne záznamy neboli nájdené</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {records.map((record) => (
                <div 
                  key={record.id} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-indigo-100 rounded-full p-3">
                        <FiUser className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{record.name}</p>
                        <div className="flex items-center text-gray-500 text-sm">
                          <FiCalendar className="w-4 h-4 mr-1" />
                          <span>{record.age} rokov</span>
                        </div>
                      </div>
                    </div>
                    
                    <a 
                      href={record.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors duration-200 mb-4 group"
                    >
                      <FiFile className="w-4 h-4" />
                      <span className="group-hover:underline">Zobraziť súbor</span>
                    </a>

                    <Link
                      href={`/records/${record.id}`}
                      className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
                    >
                      <span className="font-medium">Zobraziť detail</span>
                      <FiChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
