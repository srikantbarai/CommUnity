import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {listServiceDetails,createReviewForService,getAllReviewsForService,deleteReviewForService} from '../lib/api';
import useGetMyInfo from '../hooks/useGetMyInfo';
import ReviewCard from "../components/ReviewCard";
import Navbar from "../components/Navbar"

const ServicePage = () => {
  const queryClient = useQueryClient();
  const serviceId = window.location.pathname.split('/').pop();
  const { myInfo, isLoading: myInfoLoading, error: myInfoError } = useGetMyInfo();

  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);

  const { data: serviceData, isLoading: serviceLoading, error: serviceError } = useQuery({
    queryKey: ['serviceDetails', serviceId],
    queryFn: () => listServiceDetails(serviceId),
    select: (data) => data.data
  });

  const { data: reviewsData, isLoading: reviewsLoading, error: reviewsError } = useQuery({
    queryKey: ['reviews', serviceId],
    queryFn: () => getAllReviewsForService(serviceId),
    select: (data) => data.data
  });

  const createReviewMutation = useMutation({
    mutationFn: (reviewData) => createReviewForService(serviceId, reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries(['serviceDetails', serviceId]);
      queryClient.invalidateQueries(['reviews', serviceId]);
      setComment('');
      setRating(5);
    }
  });

  const deleteReviewForServiceMutation = useMutation({
    mutationFn: ({ serviceId, reviewId }) => deleteReviewForService(serviceId, reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries(['serviceDetails', serviceId]);
      queryClient.invalidateQueries(['reviews', serviceId]);
    }
  });

  const handleSubmitReview = (e) => {
    if (comment.trim()) {
      createReviewMutation.mutate({
        comment: comment.trim(),
        rating: rating
      });
    }
  };

  const handledeleteReviewForService = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteReviewForServiceMutation.mutate({ serviceId, reviewId });
    }
  };

  if (serviceLoading) return <div>Loading service details...</div>;
  if (serviceError) {
    return (
      <div style={{ color: 'red' }}>
        <Navbar/>
        Error loading service: {serviceError.response?.data?.data || serviceError.message}
      </div>
    );
  }

  return (
    <div>
      <Navbar/>
      <div style={{ border: "2px solid black", margin: "10px", padding: "10px" }}>
        <img
              src={serviceData.imageUrl}
              alt="Enterprise"
              width="50"
              height="50"
              style={{ marginRight: "10px" }}
            />
        <h1>{serviceData.enterpriseName}</h1>
        <p>{serviceData.description}</p>
        <p>Category: {serviceData.category}</p>
        <p>Description: {serviceData.description}</p>
        <p>Address: {serviceData.address}, {serviceData.location.city}, {serviceData.location.state}</p>
        <p>Phone: {serviceData.contact_info.phone}</p>
        <p>Email: {serviceData.contact_info.email}</p>
        <p>Rating: {serviceData.averageRating} ⭐</p>
        <p>Total Reviews: {serviceData.reviewCount}</p>

        <div style={{ display: "flex", alignItems: "center" }}>
          <span>Service owner: <img
              src={serviceData.ownerId.profilePicUrl || "/user.webp"}
              alt="Profile"
              width="50"
              height="50"
              style={{ marginRight: "10px" }}
          /> {serviceData.ownerId.fullName} {serviceData.ownerId.email}</span>
        </div>
      </div>


      <div>
        <h2>Add a Review</h2>
        <div>
          <div>
            <label htmlFor="rating">Rating:</label>
            <div id="rating" style={{ cursor: "pointer", fontSize: "24px" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  style={{ color: star <= rating ? "gold" : "gray" }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor='comment'>Comment:</label>
            <textarea
              id='comment'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review here..."
              required
            />
          </div>
          <button
            onClick={handleSubmitReview}
            disabled={createReviewMutation.isLoading}
          >
            {createReviewMutation.isLoading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>

        {createReviewMutation.error && (
          <p style={{ color: 'red' }}>
            Error submitting review: {
              createReviewMutation.error.response?.data?.data ||
              createReviewMutation.error.message
            }
          </p>
        )}
      </div>

      <div>
        <h2>Reviews</h2>
        {reviewsLoading && <div>Loading reviews...</div>}
        {reviewsError && (
          <div style={{ color: 'red' }}>
            Error loading reviews: {
              reviewsError.response?.data?.data || reviewsError.message
            }
          </div>
        )}
        {deleteReviewForServiceMutation.error && (
          <p style={{ color: 'red' }}>
            Error deleting review: {
              deleteReviewForServiceMutation.error.response?.data?.data ||
              deleteReviewForServiceMutation.error.message
            }
          </p>
        )}

        {reviewsData && reviewsData.length > 0 ? (
          <div>
            {reviewsData.map((review) => (
              <div key={review._id} style={{ position: 'relative' }}>
                <ReviewCard
                  user={review.userId}
                  comment={review.comment}
                  rating={review.rating}
                  createdAt={review.createdAt}
                />
                {myInfo && myInfo._id === review.userId._id && (
                  <button
                    onClick={() => handledeleteReviewForService(review._id)}
                    disabled={deleteReviewForServiceMutation.isLoading}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'red',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      cursor: 'pointer',
                      borderRadius: '4px'
                    }}
                  >
                    {deleteReviewForServiceMutation.isLoading ? 'Deleting...' : 'Delete'}
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          !reviewsLoading && <p>No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
};

export default ServicePage;
