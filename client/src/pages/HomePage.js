import React from 'react';
//import { useNavigate } from 'react-router-dom';
import { /*Button, */Container } from '@mui/material';
import { ActivityList, NewsList } from '../components';
import './HomePage.scss';

export default function HomePage() {
    // const navigate = useNavigate();
    // function logout() {
    //     sessionStorage.removeItem('token');
    //     navigate('/');
    // }

    return (
        <>
            <Container>
                <h2>Page d'accueil</h2>
                {/* <Button color="primary" sx={{ my: 2, color: 'blue', display: 'block' }} onClick={() => logout}>Logout</Button> */}
                <NewsList />
                <ActivityList />
            </Container>
        </>
    );
}