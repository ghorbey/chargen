import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { NavigationBar, LocalRoutes } from '../components';
import { useToken } from '../common';

export default function Navigation(props) {
    const { token, setToken } = useToken();

    return (
        <Router>
            <NavigationBar token={token}></NavigationBar>
            <LocalRoutes token={token} setToken={setToken} />
        </Router>
    );
}