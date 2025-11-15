
import React, { useState } from 'react';
import type { Mentor } from '../types';

interface MentorFormProps {
  addMentor: (mentor: Omit<Mentor, 'id' | 'status' | 'created_at'>) => void;
}

const MentorForm: React.FC<MentorFormProps> = ({ addMentor }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    skills: '',
    availability: '',
    preferred_location: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Fix: Add a type guard to ensure `value` is a string before calling .trim(), resolving an error where `value` was of type 'unknown'.
    if (Object.values(formData).some(value => typeof value === 'string' && value.trim() === '')) {
      alert('Please fill out all fields.');
      return;
    }
    addMentor(formData);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Become a Mentor</h2>
      <p className="text-gray-600 mb-6">Share your knowledge and experience with the next generation. Fill out the form below to create your profile.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput label="Full Name" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="e.g., Jane Doe" />
        <FormInput label="Phone Number" name="phone_number" type="tel" value={formData.phone_number} onChange={handleChange} placeholder="e.g., 555-123-4567" />
        <FormInput label="Skills to Teach" name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g., Woodworking, Knitting, Guitar" helperText="Separate skills with a comma." />
        <FormInput label="Availability" name="availability" value={formData.availability} onChange={handleChange} placeholder="e.g., Weekday afternoons" />
        <FormInput label="Preferred Meeting Location" name="preferred_location" value={formData.preferred_location} onChange={handleChange} placeholder="e.g., Local library, Community center" />
        <div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-md">
            Create Mentor Profile
          </button>
        </div>
      </form>
    </div>
  );
};


interface FormInputProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
    helperText?: string;
}

const FormInput: React.FC<FormInputProps> = ({ label, name, value, onChange, placeholder, type = 'text', helperText }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
        />
        {helperText && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
    </div>
);


export default MentorForm;