// in src/components/ToolCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const ToolCard = ({ tool }) => {
    // Removed all glass effect classes for stable, solid appearance
    const solidCardClass = "bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-300";

    return (
        // Card Container: Solid style with hover effect
        <div className={`rounded-xl overflow-hidden interactive-button ${solidCardClass} hover:shadow-xl`}> 
            <Link to={`/tool/${tool._id}`}>
                <img 
                    src={tool.imageUrl} 
                    alt={tool.name} 
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-[1.05]" // Image hover effect
                />
                <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1 truncate">{tool.name}</h3> {/* Tool name */}
                    <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-3">{tool.category}</p> {/* Category badge */}
                    
                    <div className="flex justify-between items-center text-xs">
                        {/* Owner Info: Highlighted */}
                        <p className="text-gray-600 dark:text-gray-300 flex items-center">
                            Owner: <span className="font-semibold ml-1 text-indigo-700 dark:text-indigo-400">{tool.owner.name}</span>
                        </p> 
                        
                        {/* Condition Badge: Visually distinct */}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            tool.condition === 'New' ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-white' :
                            tool.condition === 'Good' ? 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-white' :
                            'bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-white'
                        }`}>
                            {tool.condition}
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ToolCard;