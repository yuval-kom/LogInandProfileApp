import { useState } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import "./login.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passError, setPassError] = useState("");
  const navigateTo = useNavigate();

  function ValidateEmailOnSubmit() {
    //regular expression for email addresses.
    const regex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!regex.test(email)) setEmailError("Email is not valid");
  }

  function ValidatePasswordOnSubmit() {
    //regular expression for the password --
    //check that it contain both number and letter and has at least 6 character.
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!regex.test(password)) setPassError("Password is not valid");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    ValidateEmailOnSubmit();
    ValidatePasswordOnSubmit();
    if (emailError === "" && passError === "") {
      try {
        const { user } = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        //set navigation to the profile page when succeeding to login
        navigateTo("/profile");
      } catch (err) {
        console.log("error at login" + err);
      }
    }
  };

  return (
    <div className="login">
      <span className="loginTitle">Login</span>
      <form className="loginForm" onSubmit={handleSubmit}>
        <label className="inputLable">Email:</label>
        <input
          type="text"
          className="loginInput"
          placeholder="Enter your email..."
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError("");
          }}
        />
        <span className="errorText">{emailError}</span>
        <label className="inputLable">Password:</label>
        <input
          type="password"
          className="loginInput"
          placeholder="Enter your password..."
          onChange={(e) => {
            setPassword(e.target.value);
            setPassError("");
          }}
        />
        <span className="errorText">{passError}</span>
        <button className="loginButton" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
