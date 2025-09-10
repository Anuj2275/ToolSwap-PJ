import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../api/axiosConfig";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { user } = useAuth();
  const [myTools, setMyTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyTools = async () => {
      try {
        // We need a new backend route to get only the user's tools
        const { data } = await api.get(`/tools/user/${user._id}`);
        setMyTools(data);
      } catch (error) {
        console.error("Failed to fetch user's tools", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchMyTools();
    }
  }, [user]);

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h1 className="text-3xl font-bold">{user?.name}</h1>
        <p className="text-gray-600">{user?.email}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">My Listed Tools</h2>
        {myTools.length > 0 ? (
          <div className="space-y-4">
            {myTools.map((tool) => (
              <div
                key={tool._id}
                className="border-b pb-4 flex justify-between items-center"
              >
                <Link to={`/tool/${tool._id}`}>
                  <h3 className="text-xl font-semibold hover:text-blue-600">
                    {tool.name}
                  </h3>
                  <p className="text-gray-500">{tool.category}</p>
                </Link>
                <div>
                  {/* Update this button to be a Link */}
                  <Link
                    to={`/tool/${tool._id}/edit`}
                    className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>You have not listed any tools yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
