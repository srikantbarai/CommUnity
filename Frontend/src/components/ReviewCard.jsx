import React from "react";
import { Star, Trash2 } from "lucide-react";

const ReviewCard = ({ user, rating, comment, createdAt, canDelete, onDelete, reviewId, isDeleting }) => {
  return (
    <div className="w-full max-w-screen-xl mx-auto flex items-center gap-6 p-4 bg-white border border-black rounded-lg shadow-sm overflow-x-auto">
      <img
        src={user.profilePicUrl || "/user.webp"}
        alt="Profile"
        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
      />

      <div className="min-w-[160px] flex flex-col">
        <div className="min-w-[120px] font-semibold gray-800">{user.fullName}</div>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={16}
              fill={star <= rating ? "currentColor" : "none"}
              stroke={star <= rating ? "currentColor" : "gray"}
              className={star <= rating ? "text-yellow-400" : "text-gray-300"}
            />
          ))}
        </div>
        <span className="text-xs text-gray-500">
          {new Date(createdAt).toLocaleDateString()}
        </span>
      </div>

      <div className="text-sm text-gray-700 flex-grow">
        <span className="font-medium">Comment:</span> {comment}
      </div>

      {canDelete && (
        <button
            onClick={() => onDelete(reviewId)}
            disabled={isDeleting}
            aria-label="Delete review"
            className="text-red-600 hover:text-red-800 transition cursor-pointer"
        >
            <Trash2 size={18} />
        </button>
        )}
    </div>
  );
};

export default ReviewCard;
