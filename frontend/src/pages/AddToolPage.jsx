import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../hooks/useAuth';

const AddToolPage = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('Good');
  const [image, setImage] = useState(null);
  // Using hardcoded location for simplicity. In a real app, you'd use a map picker.
  const [location] = useState({ longitude: 77.216721, latitude: 28.644800 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  // If the user is not logged in, redirect them to the login page
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError('Please upload an image.');
      return;
    }

    setLoading(true);
    setError('');

    // We use FormData because we are sending a file (image)
    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('condition', condition);
    formData.append('longitude', location.longitude);
    formData.append('latitude', location.latitude);
    formData.append('image', image);

    try {
      // Send the form data to the backend API
      await api.post('/tools', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Navigate to the homepage on success
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to list tool.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">List a New Tool</h2>
      {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Tool Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Category</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Condition</label>
          <select value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
            <option>New</option>
            <option>Good</option>
            <option>Fair</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700">Tool Image</label>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} required className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors">
          {loading ? 'Listing...' : 'List Tool'}
        </button>
      </form>
    </div>
  );
};

export default AddToolPage;