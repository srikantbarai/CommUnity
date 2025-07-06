import React from "react";
import { useNavigate } from "react-router-dom";

const ServiceCard = (props) => {
    const navigate = useNavigate();
    const fullAddress = `${props.address}, ${props.location.city}, ${props.location.state}`;

    const handleViewService = () => {
        navigate(`services/${props._id}`);
    };

    return (
        <div style={{ border: "2px solid black" }}>
            <img src={props.imageUrl} alt={`${props.enterpriseName} logo`} width="100" />
            <h3>{props.enterpriseName}</h3>
            <p>Average Rating: {props.averageRating}</p>
            <p>Category: {props.category}</p>
            <p>Address: {fullAddress}</p>
            <button onClick={handleViewService}>View Service</button>
        </div>
    );
};

export default ServiceCard;
