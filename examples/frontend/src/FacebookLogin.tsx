import React from 'react';
import FacebookButton from 'react-facebook-login';
import axios from 'axios';

export const FacebookLogin = () => {
    function handleFacebookLogin(response: any) {
        axios.post('http://localhost:8080/auth/facebook', {
            accessToken: response.accessToken,
        })
    }

    return (
        <FacebookButton 
            appId={process.env.REACT_APP_FACEBOOK_APP_ID!}
            callback={handleFacebookLogin}
        />
    );
}