import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { /*Button, */Container } from '@mui/material';
import { ActivityList, NewsList } from '../components';
import './HomePage.scss';

export default function HomePage() {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (pathname === '/logout') {
            sessionStorage.removeItem('token');
            navigate('/');
            window.location.reload(false);
        }
    });

    return (
        <>
            <Container>
                <h2>Page d'accueil</h2>
                <NewsList />
                <ActivityList />
            </Container>
        </>
    );
}