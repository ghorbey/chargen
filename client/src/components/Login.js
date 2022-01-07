import React, { useState } from 'react';
import PropTypes from 'prop-types';
import sha256 from 'crypto-js/sha256';
import UserService from '../services/User.service';
import './Login.scss';

async function loginUser(credentials) {
    return UserService.login(credentials);
}

export default function Login({ setToken }) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { token, message } = await loginUser({ email, password: sha256(password).toString() });
        setErrorMessage(message);
        if (token) {
            setToken(token);
        }
    }

    return (
        <div>
            <h2>Zone de connexion</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Email</p>
                    <input type="text" onChange={e => setEmail(e.target.value)} />
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" onChange={e => setPassword(e.target.value)} />
                </label>
                <div>
                    <button type="submit">Submit</button>
                </div>
                <div>{errorMessage}</div>
            </form>
        </div>
    );
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
}