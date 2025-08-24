import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import ToolCard from '../components/ToolCard';

const HomePage = () => {
  const [tools, setTools] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lat = 28.644800;
        const lng = 77.216721;
        const dist = 50000; 

        const toolsResponse = await api.get(`/tools/nearby?lat=${lat}&lng=${lng}&dist=${dist}`);
        setTools(toolsResponse.data);
        
        const usersResponse = await api.get('/users/online');
        setOnlineUsers(usersResponse.data.map(user => user._id));

      } catch (err) {
        setError('Could not fetch data.',err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading tools...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Tools Near You</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tools.length > 0 ? (
          tools.map(tool => <ToolCard key={tool._id} tool={tool} onlineUsers={onlineUsers} />)
        ) : (
          <p>No tools found nearby.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;