import React, { useState } from 'react';
import { signIn } from '../../services/signinService';
import './SignInForm.css';

interface SignInForm {
    passBackResponse: (response: any) => void;
}

const SignInForm: React.FC<SignInForm> = ({ passBackResponse }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!username.trim()) {
            alert("Please enter a username");
            return;
        }

        if (!email.trim()) {
            alert("Please enter an email");
            return;
        }

        if (!password.trim()) {
            alert("Please enter a password");
            return;
        }

        try {
            const data = await signIn(username, email, password);

            setUsername("");
            setEmail("");
            setPassword("");

            console.log("DATA", data);

            passBackResponse(data);
        } catch (error) {
            console.error("Failed to create uer:", error);

            alert("Signin failed. Please check your credentials.");
        }
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    return (
        <form className="login" onSubmit={submit}>

            <h1 className='login-title'>Sign In</h1>

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

                <label htmlFor="email" className="sr-only">Email</label>
                <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    autoFocus
                    value={email}
                    className="login-input"
                    onChange={handleEmailChange}
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
                Sign In
            </button>

        </form>
    );
};

export default SignInForm;
