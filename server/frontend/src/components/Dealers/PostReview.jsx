import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';

const PostReview = () => {
  const { id } = useParams();  // correct param name
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);

  const dealer_url = `${process.env.REACT_APP_BACKEND_URL}/djangoapp/dealer/${id}`;
  const review_url = `${process.env.REACT_APP_BACKEND_URL}/djangoapp/add_review`;
  const carmodels_url = `${process.env.REACT_APP_BACKEND_URL}/djangoapp/get_cars`;

  const postreview = async () => {
    let firstname = sessionStorage.getItem("firstname");
let lastname = sessionStorage.getItem("lastname");
let username = sessionStorage.getItem("username");

let name = (firstname && lastname && firstname !== "null" && lastname !== "null")
  ? `${firstname} ${lastname}`
  : username;

if (!name) {
  alert("User name not found. Please login again.");
  return;
}


    if (!model || !review || !date || !year) {
      alert("All details are mandatory");
      return;
    }

    const [make_chosen, model_chosen] = model.split(" ");

    const jsoninput = JSON.stringify({
      name,
      dealership: id,
      review,
      purchase: true,
      purchase_date: date,
      car_make: make_chosen,
      car_model: model_chosen,
      car_year: year,
    });

    const res = await fetch(review_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsoninput,
    });

    const json = await res.json();
    if (json.status === 200) {
      window.location.href = `/dealer/${id}`;
    }
  };

  const get_dealer = async () => {
    const res = await fetch(dealer_url);
    const retobj = await res.json();
    if (retobj.status === 200) {
      setDealer(retobj.dealer);  // fixed: not an array
    }
  };

  const get_cars = async () => {
    const res = await fetch(carmodels_url);
    const retobj = await res.json();
    setCarmodels(Array.from(retobj.CarModels));
  };

  useEffect(() => {
    get_dealer();
    get_cars();
  }, []);

  return (
    <div>
      <Header />
      <div style={{ margin: "5%" }}>
        <h1 style={{ color: "darkblue" }}>{dealer.full_name}</h1>

        <textarea
          id='review'
          cols='50'
          rows='7'
          placeholder="Write your review here..."
          onChange={(e) => setReview(e.target.value)}
        ></textarea>

        <div className='input_field'>
          Purchase Date{" "}
          <input type="date" onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className='input_field'>
          Car Make & Model{" "}
          <select name="cars" id="cars" onChange={(e) => setModel(e.target.value)} defaultValue="">
            <option value="" disabled hidden>Choose Car Make and Model</option>
            {carmodels.map(carmodel => (
              <option key={carmodel.CarMake + carmodel.CarModel} value={`${carmodel.CarMake} ${carmodel.CarModel}`}>
                {carmodel.CarMake} {carmodel.CarModel}
              </option>
            ))}
          </select>
        </div>

        <div className='input_field'>
          Car Year{" "}
          <input
            type="number"
            onChange={(e) => setYear(e.target.value)}
            max={2025}
            min={2015}
          />
        </div>

        <div>
          <button className='postreview' onClick={postreview}>
            Post Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostReview;
