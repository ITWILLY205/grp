import { createFileRoute, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Users, AlertTriangle, Save, X } from "lucide-react";

export const Route = createFileRoute('/discipline-master/deduct-marks/$id')({
  component: StudentDeductMarks,
});

function StudentDeductMarks() {
  const { id } = useParams({ from: "/discipline-master/deduct-marks/$id" });
  
  // Mock student data - in real app this would come from API
  const student = {
    id: id || '1',
    name: 'John Smith',
    indexNumber: 'STU001',
    class: 'Form 4',
    stream: 'Science'
  };

  const [formData, setFormData] = useState({
    mistake: '',
    deductedMarks: '',
    description: ''
  });

  const [errors, setErrors] = useState({
    mistake: '',
    deductedMarks: '',
    description: ''
  });

  const commonMistakes = [
    'Late to class',
    'Missing homework',
    'Disruptive behavior',
    'Cheating in exam',
    'Not wearing uniform',
    'Using phone in class',
    'Fighting with other students',
    'Disrespect to teachers'
  ];

  const validateForm = () => {
    const newErrors = {
      mistake: '',
      deductedMarks: '',
      description: ''
    };

    if (!formData.mistake.trim()) {
      newErrors.mistake = 'Mistake is required';
    }

    if (!formData.deductedMarks.trim()) {
      newErrors.deductedMarks = 'Deducted marks is required';
    } else if (isNaN(Number(formData.deductedMarks)) || Number(formData.deductedMarks) < 0) {
      newErrors.deductedMarks = 'Please enter a valid number';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return !newErrors.mistake && !newErrors.deductedMarks && !newErrors.description;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Here you would save the data to your backend
      console.log('Deduct marks data:', {
        studentId: student.id,
        ...formData
      });
      
      // Show success message or redirect
      alert('Marks deducted successfully!');
      window.location.href = '/discipline-master/deduct-marks';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.history.back()}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Deduct Marks</h1>
            <p className="text-sm text-gray-600 mt-1">Record discipline marks deduction</p>
          </div>
        </div>
      </div>

      {/* Student Info Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-4 rounded-full">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{student.name}</h2>
            <p className="text-sm text-gray-500">{student.indexNumber}</p>
            <p className="text-sm text-gray-500">{student.class} - {student.stream}</p>
          </div>
        </div>
      </div>

      {/* Deduction Form */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Mark Deduction Details</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Mistake Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mistake <span className="text-red-500">*</span>
            </label>
            <select
              name="mistake"
              value={formData.mistake}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.mistake ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select a mistake</option>
              <option value="">--- Custom Entry ---</option>
              {commonMistakes.map((mistake) => (
                <option key={mistake} value={mistake}>{mistake}</option>
              ))}
            </select>
            {formData.mistake === '' && (
              <input
                type="text"
                name="mistake"
                value={formData.mistake}
                onChange={handleInputChange}
                placeholder="Enter custom mistake..."
                className={`w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.mistake ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            )}
            {errors.mistake && (
              <p className="mt-1 text-sm text-red-600">{errors.mistake}</p>
            )}
          </div>

          {/* Deducted Marks Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deducted Marks <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="deductedMarks"
              value={formData.deductedMarks}
              onChange={handleInputChange}
              placeholder="Enter marks to deduct"
              min="0"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.deductedMarks ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.deductedMarks && (
              <p className="mt-1 text-sm text-red-600">{errors.deductedMarks}</p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Provide detailed description of the incident..."
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Deduct Marks
            </button>
          </div>
        </form>
      </div>

      {/* Recent Deductions (Optional) */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Deductions for {student.name}</h2>
        </div>
        <div className="p-6">
          <div className="text-center text-gray-500 py-8">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p>No recent deductions found</p>
          </div>
        </div>
      </div>
    </div>
  );
}
