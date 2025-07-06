import React, { useState } from "react";
import "./Register.css";
import user_icon from "../assets/person.png";
import email_icon from "../assets/email.png";
import password_icon from "../assets/password.png";
import close_icon from "../assets/close.png";

const Register = () => {
  // State variables for form inputs
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to home
  const gohome = () => {
    window.location.href = window.location.origin;
  };

  // Handle form submission
  const register = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!userName || !password || !email || !firstName || !lastName) {
      alert("Please fill in all fields.");
      return;
    }

    let register_url = window.location.origin + "${process.env.REACT_APP_BACKEND_URL}/djangoapp/register";

    try {
      setIsLoading(true);
      const res = await fetch(register_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName,
          password,
          firstName,
          lastName,
          email,
        }),
      });

      const json = await res.json();
      setIsLoading(false);

      if (json.status) {
        sessionStorage.setItem("username", json.userName);
        window.location.href = window.location.origin;
      } else if (json.error === "Already Registered") {
        alert("The user with the same username is already registered.");
        window.location.href = window.location.origin;
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      setIsLoading(false);
      alert("Server error. Please check your connection.");
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="register_container" style={{ width: "50%" }}>
      <div
        className="header"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <span className="text" style={{ flexGrow: "1" }}>
          SignUp
        </span>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifySelf: "end",
            alignSelf: "start",
          }}
        >
          <a
            href="/"
            onClick={() => {
              gohome();
            }}
            style={{ justifyContent: "space-between", alignItems: "flex-end" }}
          >
            <img style={{ width: "1cm" }} src={close_icon} alt="X" />
          </a>
        </div>
        <hr />
      </div>

      <form onSubmit={register}>
        <div className="inputs">
          <div className="input">
            <img src={user_icon} className="img_icon" alt="Username" />
            <input
              type="text"
              name="username"
              required
              placeholder="Username"
              className="input_field"
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="input">
            <img src={user_icon} className="img_icon" alt="First Name" />
            <input
              type="text"
              name="first_name"
              required
              placeholder="First Name"
              className="input_field"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="input">
            <img src={user_icon} className="img_icon" alt="Last Name" />
            <input
              type="text"
              name="last_name"
              required
              placeholder="Last Name"
              className="input_field"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="input">
            <img src={email_icon} className="img_icon" alt="Email" />
            <input
              type="email"
              name="email"
              required
              placeholder="Email"
              className="input_field"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input">
            <img src={password_icon} className="img_icon" alt="Password" />
            <input
              name="psw"
              type="password"
              required
              placeholder="Password"
              className="input_field"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="submit_panel">
          <input
            className="submit"
            type="submit"
            value={isLoading ? "Registering..." : "Register"}
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
};

export default Register;
