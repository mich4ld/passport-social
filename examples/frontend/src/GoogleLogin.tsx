import React, { useEffect } from 'react';
import axios from 'axios';

type OnLoadCallback = ((this: GlobalEventHandlers, ev: Event) => any)

function loadGoogleScript(cb: OnLoadCallback, err: OnErrorEventHandler) {
    const src = "https://accounts.google.com/gsi/client";

    const script = document.createElement('script');
    const head = document.querySelector('head');
    script.setAttribute('src', src);

    head?.appendChild(script);

    script.onload = cb;
    script.onerror = err;
}

export const GoogleLogin = () => {
    useEffect(() => {
        loadGoogleScript(onLoadScript, onErrorScript);
    }, []);

    function onLoadScript() {
        window.google.accounts.id.initialize({
            'client_id': process.env.REACT_APP_GOOGLE_CLIENT_ID,
            'callback': handleCallbackResponse,
        });

        window.google.accounts.id.renderButton(
            document.getElementById('google-login'),
            { theme: 'outline' }
        )
    }

    async function handleCallbackResponse(response: any) {
        console.log(response);
        const result = await axios.post('http://localhost:8080/auth/google', response);
        console.log(result);
    }

    function onErrorScript() {
        console.log('[ERROR]');
    }

    return (
        <div id="google-login"></div>
    )
}