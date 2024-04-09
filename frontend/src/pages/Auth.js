import React, { useRef, useState, useContext } from "react";
import './Auth.css';
import AuthContext from "../context/auth-context";

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const emailEl = useRef(null);
    const passwordEl = useRef(null);

    const { login } = useContext(AuthContext);
    
    const switchModeHandler = () => {
        setIsLogin(prevStateLogin => !prevStateLogin);
    };

    const submitHandler = event => {
        event.preventDefault();
        const email = emailEl.current.value;
        const password = passwordEl.current.value;

        if (email.trim().length === 0 || password.trim().length === 0) {
            return;
        }

        const requestBody = {
            query: `
                ${isLogin ? 'query' : 'mutation'} {
                    ${isLogin ? 'login' : 'createUser'}(email: "${email}", password: "${password}") {
                        userId
                        token
                        tokenExpiration
                    }
                }
            `
        };
        

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            if (resData.data.login.token) {
                login(
                    resData.data.login.token,
                    resData.data.login.userId,
                    resData.data.login.tokenExpiration
                );
            }
        })
        .catch(err => {
            console.log(err);
        });
    };

    return (
        <form className="auth-form" onSubmit={submitHandler}>
            <div className="form-control">
                <label htmlFor="email">E-Mail</label>
                <input type="email" id="email" ref={emailEl} />
            </div>
            <div className="form-control">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" ref={passwordEl} />
            </div>
            <div className="form-actions">
                <button type="submit">Submit</button>
                <button type="button" onClick={switchModeHandler}>
                    Switch to {isLogin ? 'Signup' : 'Login'}
                </button>
            </div>
        </form>
    );
};

export default AuthPage;