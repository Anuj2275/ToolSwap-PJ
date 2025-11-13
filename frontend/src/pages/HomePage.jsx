import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import ToolCard from '../components/ToolCard';
import Loader from '../components/Loader';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';


const HomePage = () => {
  // state initialization
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  // New state for mobile sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const { user } = useAuth();

  // data fetching logic 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const lat = 28.644800; 
        const lng = 77.216721; 
        const dist = 50000; 

        const toolsResponse = await api.get(`/tools/nearby?lat=${lat}&lng=${lng}&dist=${dist}`); 
        setTools(toolsResponse.data);

      } catch (err) {
        setError('Could not fetch data.', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter tools logic 
  const filteredTools = tools.filter(tool => {
    const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Determine unique categories
  const categories = ['All', 'Power Tools', 'Garden', 'Hand Tools', 'Welding', 'Automotive'];

  const solidCardClass = "bg-white dark:bg-gray-700 shadow-2xl transition-colors duration-500";
  const sidebarClass = "w-64 flex-shrink-0 p-6 bg-gray-200 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700";

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Function to render the navigation menu (used for both desktop and mobile)
  const renderSidebarContent = () => (
    <>
      <h3 className="text-xl font-bold mb-6 text-indigo-700 dark:text-indigo-400">Categories</h3>
      <nav className="space-y-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => { setActiveCategory(category); setSearchTerm(''); setIsSidebarOpen(false); }} // Close on selection
            className={`w-full text-left p-3 rounded-xl flex items-center transition-all duration-200 font-medium ${
              activeCategory === category
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className="w-5 h-5 mr-3 flex items-center justify-center font-bold">{category.charAt(0)}</span> 
            {category}
          </button>
        ))}
      </nav>
      
      <div className="mt-10 pt-6 border-t border-gray-300 dark:border-gray-700">
        <h3 className="text-lg font-bold mb-4 text-indigo-700 dark:text-indigo-400">My Actions</h3>
        <nav className="space-y-2">
          {user && (
            <>
              <Link to="/profile" onClick={() => setIsSidebarOpen(false)} className="w-full text-left p-3 rounded-xl flex items-center text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <span className="w-5 h-5 mr-3">👤</span> 
                Profile
              </Link>
              <Link to="/dashboard" onClick={() => setIsSidebarOpen(false)} className="w-full text-left p-3 rounded-xl flex items-center text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <span className="w-5 h-5 mr-3">⚙️</span> 
                Dashboard
              </Link>
            </>
          )}
        </nav>
      </div>
    </>
  );

  if (loading) return <Loader />;

  return (
    <div className="min-h-[85vh] p-4 sm:p-8"> {/* Adjusted padding */}
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 z-40 lg:hidden bg-black bg-opacity-50 transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      ></div>

      {/* Outer Container with responsive layout */}
      <div className={`flex flex-col lg:flex-row w-full min-h-[85vh] lg:h-[85vh] rounded-2xl ${solidCardClass}`}> 
        
        {/* Left Navigation Panel (Hidden on Mobile by default, controlled by state) */}
        <div 
          className={`fixed top-0 left-0 h-full z-50 lg:static lg:h-auto ${sidebarClass} transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className='lg:hidden flex justify-end mb-4'>
             <button onClick={toggleSidebar} className="text-gray-700 dark:text-gray-300 text-3xl">×</button>
          </div>
          {renderSidebarContent()}
        </div>

        {/* Hamburger Menu Toggle (Only visible on mobile) */}
        <button
          onClick={toggleSidebar}
          className="fixed top-16 left-4 z-30 p-2 lg:hidden bg-indigo-600 text-white rounded-lg shadow-lg"
        >
          ☰
        </button>


        {/* Main Content Area (Scrollable Feed) */}
        <div className="flex-1 p-4 sm:p-8 overflow-y-auto bg-white dark:bg-gray-700/80">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sticky top-0 bg-white dark:bg-gray-700 z-10 py-2">
            <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-4 sm:mb-0">
              {activeCategory} Tools
            </h1> 
            
            {/* Search Input (Takes full width on mobile) */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search Tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-full bg-gray-100 dark:bg-gray-900 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span> 
            </div>
          </div>

          {error && <p className="text-red-500 mb-4 bg-red-100 p-3 rounded-lg">{error}</p>}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6"> {/* Responsive grid */}
            {filteredTools.length > 0 ? (
              filteredTools.map(tool => <ToolCard key={tool._id} tool={tool} />)
            ) : (
              <p className="text-gray-500 dark:text-gray-400 col-span-full text-center mt-12">No tools match your criteria.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;