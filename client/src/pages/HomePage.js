import React from 'react';
import Container from '@mui/material/Container';
import { ActivityList, NewsList } from '../components';
import './HomePage.scss';

export default function HomePage() {
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