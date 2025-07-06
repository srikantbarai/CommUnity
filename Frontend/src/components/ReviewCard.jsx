import React from "react";
import {User} from "lucide-react"

const ReviewCard = (props) => {
  return (
    <div style={{ border: "2px solid black", margin: "10px", padding: "10px" }}>
        <img
            src={props.user.profilePicUrl || "/user.webp"}
            alt="Profile"
            width="50"
            height="50"
        />
        <h3>{props.user.fullName}</h3>
        <p>
            Rating:{" "}
            {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} style={{ color: star <= props.rating ? "gold" : "gray" }}>
                ★
                </span>
            ))}
            </p>

        <p>Comment: {props.comment}</p>
        <p>Reviewed on: {new Date(props.createdAt).toLocaleDateString()}</p>
        </div>
  );
};

export default ReviewCard;
