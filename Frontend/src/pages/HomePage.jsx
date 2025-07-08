import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import Navbar from "../components/Navbar";
import ServiceCard from "../components/ServiceCard";
import { serviceCategories } from '../lib/serviceCategories';
import { listServices } from "../lib/api";
import { serviceLocations, stateEnum } from "../lib/serviceLocations";

const HomePage = () => {
  const [filter, setFilter] = useState({ category: '', city: '', state: '' });
  const [searchFilters, setSearchFilters] = useState({ category: '', city: '', state: '' });

  const { data: services = [], isLoading, error } = useQuery({
    queryKey: ['services', searchFilters],
    queryFn: () => listServices(searchFilters),
    select: (data) => data.data
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'state' ? { city: '' } : {})
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchFilters(filter);
  };

  const availableCities = filter.state ? serviceLocations[filter.state].sort() : [];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar />

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="category" className="block font-medium mb-1">Category:</label>
              <select
                id="category"
                name="category"
                value={filter.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="">Select Category</option>
                {serviceCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="state" className="block font-medium mb-1">State:</label>
              <select
                id="state"
                name="state"
                value={filter.state}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="">Select State</option>
                {stateEnum.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="city" className="block font-medium mb-1">City:</label>
              <select
                id="city"
                name="city"
                value={filter.city}
                onChange={handleChange}
                disabled={!filter.state}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-100"
              >
                <option value="">Select City</option>
                {availableCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Search for Services
            </button>
          </div>
        </form>

        <div>
          <h1 className="text-2xl font-semibold mb-4">Available Services</h1>

          {isLoading && (
            <div className="text-gray-600">Loading services...</div>
          )}

          {error && (
            <div className="text-red-600">Error: {error.response?.data?.data || error.message}</div>
          )}

          {!isLoading && !error && services.length === 0 && (
            <p className="text-gray-500 italic">No services found.</p>
          )}

          {services.length > 0 && (
            <>
              <p className="mb-4 text-sm text-gray-600">Found {services.length} services</p>
              <div className="space-y-4">
                {services.map(service => (
                  <ServiceCard
                    key={service._id}
                    _id={service._id}
                    imageUrl={service.imageUrl}
                    enterpriseName={service.enterpriseName}
                    averageRating={service.averageRating}
                    category={service.category}
                    address={service.address}
                    location={service.location}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
