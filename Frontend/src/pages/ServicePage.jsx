import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Star } from 'lucide-react';

import Navbar from '../components/Navbar';
import ReviewCard from '../components/ReviewCard';
import useGetMyInfo from '../hooks/useGetMyInfo';
import {listServiceDetails,createReviewForService,getAllReviewsForService,deleteReviewForService} from '../lib/api';

const ServicePage = () => {
  const queryClient = useQueryClient();
  const serviceId = window.location.pathname.split('/').pop();
  const { myInfo } = useGetMyInfo();

  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);

  const { data: serviceData, isLoading: serviceLoading, error: serviceError } = useQuery({
    queryKey: ['serviceDetails', serviceId],
    queryFn: () => listServiceDetails(serviceId),
    select: (data) => data.data,
  });

  const { data: reviewsData, isLoading: reviewsLoading, error: reviewsError } = useQuery({
    queryKey: ['reviews', serviceId],
    queryFn: () => getAllReviewsForService(serviceId),
    select: (data) => data.data,
  });

  const createReviewMutation = useMutation({
    mutationFn: (reviewData) => createReviewForService(serviceId, reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries(['serviceDetails', serviceId]);
      queryClient.invalidateQueries(['reviews', serviceId]);
      setComment('');
      setRating(5);
    },
  });

  const deleteReviewForServiceMutation = useMutation({
    mutationFn: ({ serviceId, reviewId }) => deleteReviewForService(serviceId, reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries(['serviceDetails', serviceId]);
      queryClient.invalidateQueries(['reviews', serviceId]);
    },
  });

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      createReviewMutation.mutate({
        comment: comment.trim(),
        rating: rating,
      });
    }
  };

  const handledeleteReviewForService = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteReviewForServiceMutation.mutate({ serviceId, reviewId });
    }
  };

  if (serviceLoading)
    return (
      <div className="text-center mt-8 text-gray-700">Loading service details...</div>
    );
  if (serviceError)
    return (
      <div className="text-red-600 p-4">
        <Navbar />
        Error loading service: {serviceError.response?.data?.data || serviceError.message}
      </div>
    );

  const StarRatingDisplay = ({ rating }) => {
    const fullStars = Math.floor(rating);
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={20}
            fill={star <= fullStars ? 'currentColor' : 'none'}
            stroke={star <= fullStars ? 'currentColor' : 'gray'}
            className={star <= fullStars ? 'text-yellow-400' : 'text-gray-300'}
          />
        ))}
        <span className="ml-2 font-semibold text-gray-700">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto border-2 border-black rounded-lg p-6 mt-6 bg-white shadow-md">
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={serviceData.imageUrl}
            alt="Enterprise"
            className="w-16 h-16 object-cover rounded"
          />
          <h1 className="text-3xl font-bold">{serviceData.enterpriseName}</h1>
        </div>
        <p className="mb-2 text-gray-700">{serviceData.description}</p>
        <p className="mb-1">
          <span className="font-semibold">Category:</span> {serviceData.category}
        </p>
        <p className="mb-1">
          <span className="font-semibold">Address:</span> {serviceData.address},{' '}
          {serviceData.location.city}, {serviceData.location.state}
        </p>
        <p className="mb-1">
          <span className="font-semibold">Phone:</span> {serviceData.contact_info.phone}
        </p>
        <p className="mb-1">
          <span className="font-semibold">Email:</span> {serviceData.contact_info.email}
        </p>
        <div className="mb-2">
          <span className="font-semibold">Rating:</span>{' '}
          <StarRatingDisplay rating={serviceData.averageRating} />
        </div>
        <p className="mb-4">
          <span className="font-semibold">Total Reviews:</span> {serviceData.reviewCount}
        </p>
        <div className="flex items-center space-x-4">
          <img
            src={serviceData.ownerId.profilePicUrl || '/user.webp'}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="text-gray-800">
            <p className="font-semibold">{serviceData.ownerId.fullName}</p>
            <p className="text-sm">{serviceData.ownerId.email}</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Add a Review</h2>
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label htmlFor="rating" className="block font-semibold mb-1">
              Rating:
            </label>
            <div className="inline-flex gap-2 text-2xl cursor-pointer" id="rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`select-none ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  aria-label={`${star} star${star > 1 ? 's' : ''}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setRating(star);
                    }
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="comment" className="block font-semibold mb-1">
              Comment:
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review here..."
              required
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <button
            type="submit"
            disabled={createReviewMutation.isLoading}
            className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-indigo-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createReviewMutation.isLoading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>

        {createReviewMutation.error && (
          <p className="mt-2 text-red-600">
            Error submitting review:{' '}
            {createReviewMutation.error.response?.data?.data || createReviewMutation.error.message}
          </p>
        )}
      </div>

      <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        {reviewsLoading && <div className="text-gray-700">Loading reviews...</div>}
        {reviewsError && (
          <div className="text-red-600">
            Error loading reviews: {reviewsError.response?.data?.data || reviewsError.message}
          </div>
        )}
        {deleteReviewForServiceMutation.error && (
          <p className="text-red-600">
            Error deleting review:{' '}
            {deleteReviewForServiceMutation.error.response?.data?.data ||
              deleteReviewForServiceMutation.error.message}
          </p>
        )}

        {reviewsData && reviewsData.length > 0 ? (
          <div className="space-y-4">
            {reviewsData.map((review) => (
              <ReviewCard
                key={review._id}
                user={review.userId}
                comment={review.comment}
                rating={review.rating}
                createdAt={review.createdAt}
                reviewId={review._id}
                canDelete={myInfo && myInfo._id === review.userId._id}
                onDelete={handledeleteReviewForService}
                isDeleting={deleteReviewForServiceMutation.isLoading}
              />
            ))}
          </div>
        ) : (
          !reviewsLoading && <p className="text-gray-600">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
};

export default ServicePage;
