import React from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ServiceCard = ({ _id, imageUrl, enterpriseName, averageRating, category, address, location }) => {
  const navigate = useNavigate();
  const fullAddress = `${address}, ${location.city}, ${location.state}`;

  const handleViewService = () => {
    navigate(`services/${_id}`);
  };

  return (
    <div
      onClick={handleViewService}
      className="flex items-center justify-between gap-6 p-5 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-blue-600 transition cursor-pointer"
    >
      <img
        src={imageUrl}
        alt={`${enterpriseName} logo`}
        className="w-24 h-24 rounded-md object-cover flex-shrink-0"
      />

      <div className="flex-grow text-left">
        <h3 className="text-lg font-semibold text-slate-800">{enterpriseName}</h3>
        <p className="text-sm text-slate-500 mb-1">Category: {category}</p>

        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={16}
              fill={star <= averageRating ? "#facc15" : "none"}
              stroke={star <= averageRating ? "#facc15" : "#cbd5e1"}
              className="mr-1"
            />
          ))}
          <span className="text-sm font-medium ml-2 text-slate-600">
            {averageRating?.toFixed(1) || "0.0"}
          </span>
        </div>

        <p className="text-sm mt-1 text-slate-600 truncate max-w-md">
          {fullAddress}
        </p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleViewService();
        }}
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md shadow-sm transition"
      >
        View Service
      </button>
    </div>
  );
};

export default ServiceCard;
