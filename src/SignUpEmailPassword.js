// Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignInWithGoogle from './SignInWithGoogle.js';
import './SignUpEmailPassword.css';

const SignUpEmailPassword = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [fName, setfName] = useState("");
    const [lName, setlName] = useState("");
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            // Store the user data in the db

            navigate("/dashboard");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="global-form">
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSignUp}>
                <h2>Sign Up</h2>
                <input
                    type="text"
                    placeholder="First Name"
                    value={fName}
                    onChange={(e) => setfName(e.target.value)}
                    required
                />
                <br />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={lName}
                    onChange={(e) => setlName(e.target.value)}
                    required
                />
                <br />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <br />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <br />
                <button type="submit">Sign Up</button>
                <p>or</p>
                <SignInWithGoogle />
                <p>Already have an account? <a href="/login"> Login </a></p>
            </form>
        </div>
    );
};

export default SignUpEmailPassword;