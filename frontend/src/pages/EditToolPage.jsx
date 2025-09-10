import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import Loader from '../components/Loader';

const EditToolPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', category: '', description: '', condition: 'Good' });
  const [image, setImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTool = async () => {
      try {
        const { data } = await api.get(`/tools/${id}`);
        setFormData({
          name: data.name,
          category: data.category,
          description: data.description,
          condition: data.condition,
        });
        setCurrentImageUrl(data.imageUrl);
      } catch (err) {
        setError('Failed to fetch tool data.');
      } finally {
        setLoading(false);
      }
    };
    fetchTool();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedData = new FormData();
    updatedData.append('name', formData.name);
    updatedData.append('category', formData.category);
    updatedData.append('description', formData.description);
    updatedData.append('condition', formData.condition);
    if (image) {
      updatedData.append('image', image);
    }

    try {
      await api.put(`/tools/${id}`, updatedData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/profile');
    } catch (err) {
      setError('Failed to update tool.');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this tool?')) {
      setLoading(true);
      try {
        await api.delete(`/tools/${id}`);
        navigate('/profile');
      } catch (err) {
        setError('Failed to delete tool.');
        setLoading(false);
      }
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Tool</h2>
      <form onSubmit={handleUpdate}>
        <div className="mb-4">
            <label className="block text-gray-700 mb-2">Current Image</label>
            <img src={currentImageUrl} alt="Current tool" className="w-full h-48 object-cover rounded-md" />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Tool Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700">Category</label>
          <input type="text" name="category" value={formData.category} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Condition</label>
          <select name="condition" value={formData.condition} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
            <option>New</option>
            <option>Good</option>
            <option>Fair</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700">Upload New Image (Optional)</label>
          <input type="file" onChange={handleImageChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
        </div>
        
        <div className="flex space-x-4 mt-6">
          <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            Update Tool
          </button>
          <button type="button" onClick={handleDelete} className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
            Delete Tool
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditToolPage;