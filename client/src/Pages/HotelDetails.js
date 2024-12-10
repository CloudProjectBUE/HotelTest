import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import { useParams } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function HotelDetails() {
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const { user } = useContext(UserContext);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Fetch hotel details
  useEffect(() => {
    async function fetchHotelDetails() {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/hotels/${hotelId}`);
        setHotel(response.data);
      } catch (error) {
        console.error("Error fetching hotel details:", error);
      }
    }
    fetchHotelDetails();
  }, [hotelId]);

  // Memoize the fetch functions to avoid re-creating them every render
  const fetchAverageRating = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/reviews/hotel/${hotelId}/average`);
      setAverageRating(response.data.averageRating);
    } catch (error) {
      console.error("Error fetching average rating:", error);
    }
  }, [hotelId]);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/reviews/hotel/${hotelId}`);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }, [hotelId]);

  useEffect(() => {
    fetchAverageRating();
    fetchReviews();
  }, [fetchAverageRating, fetchReviews]);

  // Submit a New Review
  async function submitReview() {
    if (!user || !user.token) {
      alert("You must be logged in to submit a review.");
      return;
    }

    const review = {
      userId: user.id,
      hotelId,
      rating,
      reviewText,
    };

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/reviews/submit`, review, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      alert("Review submitted successfully!");
      setReviewText("");
      setRating(1);
      fetchReviews(); // Re-fetch reviews to update the list
      fetchAverageRating(); // Re-fetch average rating to update the score
    } catch (error) {
      console.error("Error submitting review:", error.response ? error.response.data : error.message);
      alert("Failed to submit review.");
    }
  }

  const createOrder = async () => {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/payments/create-payment`, {
      hotelId,
      userId: "current-user-id", // Replace with dynamic user ID
      amount: 100, // Replace with dynamic amount
    });
    return response.data.id;
  };
  const onApprove = async (data) => {
     await axios.post(`${process.env.REACT_APP_API_URL}/api/payments/capture-payment`, {
      orderID: data.orderID,
    });
    setPaymentSuccess(true);
  };

  return (
    <div className="container mt-5">
      {hotel ? (
        <>
          <h2>{hotel.name}</h2>
          <p>{hotel.description}</p>
          <p>Location: {hotel.location}</p>

          {/* Average Rating Display */}
          <div className="average-rating mt-3">
            <h4>Average Rating:</h4>
            {averageRating !== null ? (
              <p>{averageRating.toFixed(1)} / 5</p>
            ) : (
              <p>Loading average rating...</p>
            )}
          </div>

          {/* Payment Section */}
          <div className="mt-5">
            <h3>Book this Hotel</h3>
            <p>Price: ${100}</p>

            {paymentSuccess ? (
              <p className="text-success">Payment Successful! Thank you for booking.</p>
            ) : (
              <PayPalScriptProvider options={{ "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID }}>
                <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
              </PayPalScriptProvider>
            )}
            {paymentSuccess && <p>Payment successful! Thank you for booking.</p>}
          </div>

          {/* Submit a Review Form */}
          <div className="submit-review mt-5">
            <h4>Submit Your Review</h4>
            <label>Rating (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              className="form-control"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            />
            <textarea
              className="form-control mt-3"
              placeholder="Write your review here"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <button className="btn btn-primary w-100 mt-3" onClick={submitReview}>
              Submit Review
            </button>
          </div>

          {/* Display All Reviews */}
          <div className="reviews-list mt-5">
            <h4>Reviews</h4>
            {reviews.length === 0 ? (
              <p>No reviews available.</p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="review mt-3 p-3 border rounded">
                  <h5>User: {review.userId.username}</h5>
                  <p>Rating: {review.rating} / 5</p>
                  <p>{review.reviewText}</p>
                  <p>
                    <strong>Response:</strong> {review.response || "No response yet"}
                  </p>
                  <p className="text-muted">Status: {review.status}</p>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <p>Loading hotel details...</p>
      )}
    </div>
  );
}

export default HotelDetails;
