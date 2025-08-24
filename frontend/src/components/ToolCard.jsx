// in src/components/ToolCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const ToolCard = ({ tool }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg ...">
      {/* This link MUST be correct. Check the backticks and ${} syntax. */}
      <Link to={`/tool/${tool._id}`}>
        <img 
          src={tool.imageUrl} 
          alt={tool.name} 
          className="w-full h-48 object-cover" 
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold">{tool.name}</h3>
          <p className="text-sm text-gray-600">{tool.category}</p>

  <p className="text-xs text-red-500 font-mono">ID: {tool.owner.name}</p> 
        </div>
      </Link>
    </div>
  );
};

export default ToolCard;