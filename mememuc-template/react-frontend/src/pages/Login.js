/**
 * References:
 * https://www.youtube.com/watch?v=6oTDAyuQ5iw
 * https://github.com/the-debug-arena/login-registration/blob/main/src/components/login_component.js
 *
 * Login by Google:
 * https://blog.logrocket.com/guide-adding-google-login-react-app/#acquiring-google-client-id-project
 * The source of Google icon is the src of <img> tag
 * */

import React, {useState, useEffect} from "react";
import "../styles/form.css";
import {googleLogout, useGoogleLogin} from '@react-oauth/google';
import axios from 'axios';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState([]);
    const [profile, setProfile] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(username, password);
        fetch("http://localhost:3002/users/login-user", {
            method: "POST",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "userLogin");
                localStorage.setItem("logStatus", "notLogged");

                if (data.status === "ok") {
                    alert("Login successful");
                    window.localStorage.setItem("logStatus", "logged");
                    window.localStorage.setItem("loggedUsername", username);
                    window.localStorage.setItem("token", data.data);
                    window.location.href = "/";
                }
            });
    }

    const login = useGoogleLogin({
        onSuccess: (response) => setUser(response),
        onError: (error) => console.log('Login Failed:', error)
    });

    const logOut = () => {
        googleLogout();
        setProfile(null);
    };

    useEffect(
        () => {
            if (user) {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        setProfile(res.data);
                    })
                    .catch((err) => console.log(err));
            }
        },
        [user]
    );

    return (
        <form className="form" onSubmit={handleSubmit}>
            <h3>Sign In</h3>

            <div className="mb-3">
                <label>Username</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label>Password</label>
                <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </div>

            <p className="forgot-password text-right">
                New here <a href="/sign-up">sign up!</a>
            </p>
            <p>Or use a third-party to log in!</p>

            {profile ? (
                <div>
                    <img src={profile.picture} alt="user image"/>
                    <h3>User Logged in</h3>
                    <p>Name: {profile.name}</p>
                    <p>Email Address: {profile.email}</p>
                    <br/>
                    <br/>
                    <button onClick={logOut}>Log out</button>
                </div>
            ) : (
                <button onClick={() => login()}><img src="https://img.icons8.com/color/25/null/google-logo.png"
                                                     alt={"google"}/></button>
            )}

        </form>
    );

}

export default Login;