// in src/components/ToolCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const ToolCard = ({ tool, onlineUsers }) => {
  const isOnline = onlineUsers.includes(tool.owner._id);

  return (
    <div className="bg-white rounded-lg shadow-lg ...">
      <Link to={`/tool/${tool._id}`}>
        <img 
          src={tool.imageUrl} 
          alt={tool.name} 
          className="w-full h-48 object-cover" 
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold">{tool.name}</h3>
          <p className="text-sm text-gray-600">{tool.category}</p>
          <p className="text-xs text-red-500 font-mono flex items-center">
            Owner: {tool.owner.name}
            {isOnline && (
              <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-green-500 text-white">Online</span>
            )}
          </p> 
        </div>
      </Link>
    </div>
  );
};

export default ToolCard;