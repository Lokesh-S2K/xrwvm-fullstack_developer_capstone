import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import review_icon from "../assets/reviewbutton.png";
import Header from '../Header/Header';

const Dealer = () => {
  const { id } = useParams(); // ✅ FIXED: match route param in App.js
  const [dealer, setDealer] = useState({});
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);

  const dealer_url = `/djangoapp/dealer/${id}`;
  const reviews_url = `/djangoapp/reviews/dealer/${id}`;
  const post_review = `/postreview/${id}`;

  const get_dealer = async () => {
    try {
      const res = await fetch(dealer_url);
      const retobj = await res.json();
      if (retobj.status === 200) {
        setDealer(retobj.dealer);
      }
    } catch (err) {
      console.error("Error fetching dealer:", err);
    }
  };

  const get_reviews = async () => {
    try {
      const res = await fetch(reviews_url);
      const retobj = await res.json();
      if (retobj.status === 200) {
        if (retobj.reviews && retobj.reviews.length > 0) {
          setReviews(retobj.reviews);
        } else {
          setUnreviewed(true);
        }
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    get_dealer();
    get_reviews();
  }, []);

  const isLoggedIn = sessionStorage.getItem("username");

  return (
    <div style={{ margin: "20px" }}>
      <Header />
      <div style={{ marginTop: "10px" }}>
        <h1 style={{ color: "grey" }}>
          {dealer.full_name}
          {isLoggedIn && (
            <a href={post_review}>
              <img
                src={review_icon}
                style={{ width: '10%', marginLeft: '10px', marginTop: '10px' }}
                alt="Post Review"
              />
            </a>
          )}
        </h1>
        <h4 style={{ color: "grey" }}>
          {dealer.city}, {dealer.address}, Zip - {dealer.zip}, {dealer.state}
        </h4>
      </div>
      <div className="reviews_panel">
        {reviews.length === 0 && !unreviewed ? (
          <p>Loading Reviews....</p>
        ) : unreviewed ? (
          <p>No reviews yet!</p>
        ) : (
          reviews.map((review, index) => (
            <div className="review_panel" key={index}>
              <div className="review">{review.review}</div>

              {review.sentiment && (
                <div className={`sentiment ${review.sentiment}`}>
                  Sentiment: <strong>{review.sentiment}</strong>
                </div>
              )}

              <div className="reviewer">
                {review.name} {review.car_make} {review.car_model} {review.car_year}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
                     

export default Dealer;
