import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import { serviceCategories } from '../lib/serviceCategories';
import { serviceLocations, stateEnum } from "../lib/serviceLocations";
import { listServices } from "../lib/api";
import ServiceCard from "../components/ServiceCard";

const HomePage = () => {
    const [filter, setFilter] = useState({
        category: '',
        city: '',
        state: ''
    });

    const [searchFilters, setSearchFilters] = useState({
        category: '',
        city: '',
        state: ''
    });

    const { data: services = [], isLoading, error } = useQuery({
        queryKey: ['services', searchFilters],
        queryFn: () => listServices(searchFilters),
        select: (data) => data.data
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'state') {
            setFilter(prev => ({
                ...prev,
                state: value,
                city: null
            }));
        } else {
            setFilter(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSearchFilters(filter);
    };

    const availableCities = filter.state ? serviceLocations[filter.state].sort() : [];

    return (
        <div>
            <Navbar/>
            <form onSubmit={handleSubmit}>
                <div>
                    <div>
                        <label htmlFor="category">Category:</label>
                        <select 
                            id="category" 
                            name="category" 
                            value={filter.category || ''} 
                            onChange={handleChange}
                        >
                            <option value="">Select Category</option>
                            {serviceCategories.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="state">State:</label>
                        <select 
                            id="state" 
                            name="state" 
                            value={filter.state || ''} 
                            onChange={handleChange}
                        >
                            <option value="">Select State</option>
                            {stateEnum.map(state => (
                                <option key={state} value={state}>
                                    {state}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="city">City:</label>
                        <select 
                            id="city" 
                            name="city" 
                            value={filter.city || ''} 
                            onChange={handleChange} 
                            disabled={!filter.state}
                        >
                            <option value="">Select City</option>
                            {availableCities.map(city => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <button type="submit">Search for Services</button>
            </form>
            
            <div>
                <h1>Available Services</h1>
                
                {isLoading && <div>Loading services...</div>}
                
                {error && (
                  <div style={{ color: 'red' }}>
                    Error: {error.response?.data?.data || error.message}
                  </div>
                )}
                
                {services && (
                    <div>
                        <p>Found {services.length} services</p>
                        {services.map((service, index) => (
                            <ServiceCard
                                key={service._id || index}
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
                )}
                
                {!isLoading && !error && !services.length && (
                    <p>No services found</p>
                )}
            </div>
        </div>
    );
};

export default HomePage;
