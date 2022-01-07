import React from 'react';
import Container from '@mui/material/Container';
import './CharacterPage.scss';

export default function CharacterPage() {
    return (
        <>
            <Container>
                <h2>Personnage</h2>
                <ul>
                    <li>Voir</li>
                    <li>Editer</li>
                    <li>Imprimer en pdf</li>
                </ul>
            </Container>
        </>
    );
}