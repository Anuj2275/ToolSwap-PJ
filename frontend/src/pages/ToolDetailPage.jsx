import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/Loader';

const ToolDetailPage = () => {
  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [requestCount, setRequestCount] = useState(0); 
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setTool(null);
    setLoading(true);
    setError('');
    setBookingMessage('');
    setRequestCount(0);

    if (!id) {
      setLoading(false);
      setError("No tool ID provided.");
      return;
    }

    const fetchData = async () => {
      try {
        const { data: toolData } = await api.get(`/tools/${id}`);
        setTool(toolData);
        
        if (user) {
          const { data: bookingsData } = await api.get('/bookings/my-bookings');
          
          const userRequestsForThisTool = bookingsData.filter(
            b => b.tool._id === id && b.borrower._id === user._id
          );
          
          const activeRequest = userRequestsForThisTool.find(
            b => b.status === 'pending' || b.status === 'approved'
          );

          if (activeRequest) {
            setRequestCount(3);
            setBookingMessage(`You have an active request for this tool. Status: ${activeRequest.status}`);
          } else {
            setRequestCount(userRequestsForThisTool.length);
            if (userRequestsForThisTool.length >= 3) {
              setBookingMessage('You have reached the maximum number of requests for this tool.');
            }
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Could not fetch tool details. The tool may have been deleted.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const handleBookingRequest = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!startDate || !endDate) {
      setError('Please select both a start and end date.');
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
        setError('End date must be after start date.');
        return;
    }

    setError('');
    setBookingMessage('');

    try {
      await api.post('/bookings', {
        toolId: tool._id,
        startDate: startDate,
        endDate: endDate,
      });
      setBookingMessage('Booking request sent successfully!');
      setRequestCount(prev => prev + 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send booking request.');
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!tool) return <p className="text-center mt-10">Tool not found.</p>;

  const canRequest = user && user._id !== tool.owner._id && requestCount < 3;
  const isButtonDisabled = !startDate || !endDate || !canRequest;

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img src={tool.imageUrl} alt={tool.name} className="w-full rounded-lg object-cover" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{tool.name}</h1>
          <p className="text-lg text-gray-600 mb-4">{tool.category}</p>
          <p className="text-gray-800 mb-4">{tool.description}</p>
          <div className="mb-4">
            <span className="font-semibold">Condition: </span>
            <span className="font-bold text-blue-600">{tool.condition}</span>
          </div>
          <div className="mb-4">
            <span className="font-semibold">Owner: </span>
            <span>{tool.owner.name} (Trust Score: {tool.owner.trustScore}/5)</span>
          </div>
          
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {bookingMessage && <p className="text-green-500 mb-4">{bookingMessage}</p>}
          
          {canRequest && (
              <div className="mb-4">
                <label className="block text-gray-700">Booking Dates and Time</label>
                <div className="flex gap-4">
                    <input 
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                        className="w-1/2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input 
                        type="datetime-local"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                        className="w-1/2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
          )}

          <button
              onClick={handleBookingRequest}
              disabled={isButtonDisabled}
              className={`w-full text-white py-2 rounded-lg transition-colors ${isButtonDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
            >
              Request to Borrow
            </button>
        </div>
      </div>
    </div>
  );
};

export default ToolDetailPage;