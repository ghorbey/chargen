import React from 'react';
import Container from '@mui/material/Container';
import './PreferencesPage.scss';

export default function PreferencesPage() {
    return (
        <>
            <Container>
                <h2>Préférences</h2>
                <ul>
                    <li>thème?</li>
                    <li>Paramètres divers</li>
                </ul>
            </Container>
        </>
    );
}