import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignInWithGoogle from './SignInWithGoogle.js';
import './SignInEmailPassword.css';

function SignInEmailPassword() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            navigate("/dashboard");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="global-form">
            <form onSubmit={handleSignIn}>
                <h2>Sign In</h2>
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
                <button type="submit">Sign In</button>
                <br />
                <p>or</p>
                <SignInWithGoogle />
                <p>Don't have an account? <a href="/signup">Sign Up</a></p>
            </form>
        </div>
    );
}

export default SignInEmailPassword;
