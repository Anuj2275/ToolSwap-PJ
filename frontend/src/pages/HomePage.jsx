// frontend/src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import ToolCard from '../components/ToolCard';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { Link } from 'react-router-dom';

// Fix for default Leaflet icon not showing up correctly with webpack
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const HomePage = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Chitkara University, Rajpura campus coordinates
  const campusPosition = [30.516, 76.657]; 
  const searchRadius = 20000; // 20 km radius for the campus area

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const { data } = await api.get(`/tools/nearby?lat=${campusPosition[0]}&lng=${campusPosition[1]}&dist=${searchRadius}`);
        setTools(data);
      } catch (err) {
        setError('Could not fetch tools.');
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Tools Near You</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Map View</h2>
          <MapContainer center={campusPosition} zoom={13} style={{ height: '500px', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {tools.map(tool => (
              <Marker key={tool._id} position={[tool.location.coordinates[1], tool.location.coordinates[0]]}>
                <Popup>
                  <div className="font-semibold">
                    <Link to={`/tool/${tool._id}`} className="text-blue-600 hover:underline">{tool.name}</Link>
                  </div>
                  <p>Owner: {tool.owner.name}</p>
                  <p>Condition: {tool.condition}</p>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">List View</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {tools.length > 0 ? (
              tools.map(tool => <ToolCard key={tool._id} tool={tool} />)
            ) : (
              <p>No tools found nearby.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;