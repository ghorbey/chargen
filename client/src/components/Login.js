import React, { useState } from 'react';
import PropTypes from 'prop-types';
import UserService from '../services/User.service';

import './Login.scss';

const MD5 = require("crypto-js/md5");

async function loginUser(credentials) {
    return UserService.login(credentials);
}

export default function Login({ setToken }) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { token } = await loginUser({ email, password: MD5(password).toString() });
        if (token) {
            setToken(token);
        } else {
            setErrorMessage(`Login et/ou mot de passe invalide!`);
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