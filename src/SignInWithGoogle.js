import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

function SignInWithGoogle() {
    const navigate = useNavigate();

    const handleSuccess = (credentialResponse)=>{
        console.log(credentialResponse);
        const decoded = jwtDecode(credentialResponse?.credential);
        console.log(decoded);
        
        
        // store the details of the user in the db


        navigate("/dashboard");
    }

    const handleError = ()=>{
        console.log('Login Failed');
    }

    return <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
    />;
}

export default SignInWithGoogle;
