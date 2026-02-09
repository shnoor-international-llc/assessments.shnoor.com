// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload, FileSpreadsheet, LogOut,
  Download, ArrowLeft, ChevronRight
} from 'lucide-react';
import CreateTestSection from '../../components/admin/CreateTestSection';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedExamId, setSelectedExamId] = useState(null); // Track selected exam for details view

  // Mock data for tests/exams
  const [tests, setTests] = useState([
    { id: 1, name: 'Java Mock Test', questions: 20, attempts: 45, avgScore: 72, date: '2024-02-10' },
    { id: 2, name: 'Aptitude Test', questions: 30, attempts: 120, avgScore: 68, date: '2024-02-08' },
    { id: 3, name: 'React.js Basics', questions: 25, attempts: 32, avgScore: 81, date: '2024-02-05' },
    { id: 4, name: 'SQL Fundamentals', questions: 15, attempts: 56, avgScore: 75, date: '2024-02-01' },
  ]);

  // Mock data for student results (all combined for now, filtered by exam in UI)
  const [studentsData, setStudentsData] = useState({
    1: [ // Results for Java Mock Test (ID: 1)
      { id: 'STU001', name: 'John Doe', score: 85, total: 100, date: '2024-02-10' },
      { id: 'STU003', name: 'Bob Wilson', score: 72, total: 100, date: '2024-02-11' },
      { id: 'STU005', name: 'Alice Brown', score: 90, total: 100, date: '2024-02-12' },
    ],
    2: [ // Results for Aptitude Test (ID: 2)
      { id: 'STU002', name: 'Jane Smith', score: 92, total: 100, date: '2024-02-09' },
      { id: 'STU004', name: 'Mike Jones', score: 65, total: 100, date: '2024-02-09' },
    ],
    3: [
      { id: 'STU006', name: 'Sarah Lee', score: 88, total: 100, date: '2024-02-06' },
    ],
    4: []
  });

  // Derived state: Get students for the selected exam
  const selectedExamStudents = selectedExamId ? (studentsData[selectedExamId] || []) : [];
  const selectedExamDetails = tests.find(t => t.id === selectedExamId);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) navigate('/admin/login');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const exportToExcel = () => {
    // Mock export
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Student ID,Name,Score,Date\n"
      + selectedExamStudents.map(s => `${s.id},${s.name},${s.score},${s.date}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `exam_${selectedExamId}_results.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="font-bold text-xl">A</span>
              </div>
              <div>
                <h1 className="font-bold text-lg">Admin Dashboard</h1>
                <p className="text-xs text-gray-400">MCQ Management System</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'upload', label: 'Create Test & Upload', icon: Upload },
              { id: 'exams', label: 'Exams & Results', icon: FileSpreadsheet },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'exams') setSelectedExamId(null); // Reset detail view when switching to exams tab
                }}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'upload' && (
          <CreateTestSection />
        )}

        {/* Exams & Results Tab */}
        {activeTab === 'exams' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {selectedExamId ? (
              /* Detail View: Student Results for a specific exam */
              <div className="p-6">
                <button
                  onClick={() => setSelectedExamId(null)}
                  className="flex items-center text-gray-600 hover:text-slate-900 mb-6 transition-colors"
                >
                  <ArrowLeft size={20} className="mr-2" />
                  Back to Exams List
                </button>

                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedExamDetails?.name}</h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{selectedExamDetails?.questions} Questions</span>
                      <span>•</span>
                      <span>Created on {selectedExamDetails?.date}</span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={exportToExcel}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <FileSpreadsheet size={18} />
                      <span>Export Excel</span>
                    </button>
                    <button
                      onClick={exportToPDF}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <Download size={18} />
                      <span>Export PDF</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Attempted</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedExamStudents.length > 0 ? (
                        selectedExamStudents.map((student, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className={`font-bold ${student.score >= 70 ? 'text-green-600' : 'text-orange-600'}`}>
                                  {student.score}
                                </span>
                                <span className="text-gray-400 text-xs ml-1">/ {student.total}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Completed
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                            No students have attempted this exam yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* List View: All Exams */
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <FileSpreadsheet className="mr-2" size={24} />
                    All Exams
                  </h2>
                  <div className="text-sm text-gray-500">
                    Total Exams: <span className="font-semibold text-gray-900">{tests.length}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {tests.map((test) => (
                    <div
                      key={test.id}
                      onClick={() => setSelectedExamId(test.id)}
                      className="bg-white border rounded-lg p-5 hover:shadow-md hover:border-slate-300 cursor-pointer transition-all group"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold text-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            {test.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">{test.name}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                              <span>Questions: {test.questions}</span>
                              <span>•</span>
                              <span>Created: {test.date}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6">
                          <div className="text-right">
                            <p className="text-xs text-gray-400 uppercase font-semibold">Attempts</p>
                            <p className="text-xl font-bold text-gray-900">{test.attempts}</p>
                          </div>
                          <div className="text-right border-l pl-6 border-gray-100">
                            <p className="text-xs text-gray-400 uppercase font-semibold">Avg Score</p>
                            <p className="text-xl font-bold text-green-600">{test.avgScore}%</p>
                          </div>
                          <ChevronRight className="text-gray-300 group-hover:text-slate-900 transition-colors" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
