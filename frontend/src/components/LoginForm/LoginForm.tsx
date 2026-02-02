import React, { useState } from 'react';
import { setAuthToken } from '../../services/apiClient';
import { logIn } from '../../services/loginService';
import './LoginForm.css';

interface LogInProps {
    passBackResponse: (response: any) => void;
}

const LoginForm: React.FC<LogInProps> = ({ passBackResponse }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const submitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!username.trim()) {
            alert("Please enter a username");
            return;
        }

        if (!password.trim()) {
            alert("Please enter a password");
            return;
        }

        try {
            const data = await logIn(username, password);

            setUsername("");
            setPassword("");

            console.log("DATA", data);

            // TODO: refactor
            let responseData = data;
            if (typeof data === 'string') {
                try {
                    responseData = JSON.parse(data);
                    console.log("Parsed data:", responseData);

                    setAuthToken(responseData.data);
                } catch (error) {
                    console.error("Failed to parse response as JSON:", error);
                    return;
                }
            }

            passBackResponse(responseData);
        } catch (error) {
            console.error("Failed to create item:", error);

            alert("Login failed. Please check your credentials.");
        }
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    return (
        <form className="login" onSubmit={submitLogin}>

            <h1 className='login-title'>Login</h1>

            <div className='form-group'>

                <label htmlFor="username" className="sr-only">Username</label>
                <input
                    type="text"
                    id="username"
                    placeholder="Username"
                    autoFocus
                    value={username}
                    className="login-input"
                    onChange={handleUsernameChange}
                />
            </div>

            <div className='form-group'>

                <label htmlFor="password" className="sr-only">Password</label>
                <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    autoFocus
                    value={password}
                    className="login-input"
                    onChange={handlePasswordChange}
                />
            </div>

            <button
                type="submit"
                className="login-button"
            >
                Login
            </button>

        </form>
    );
};

export default LoginForm;
