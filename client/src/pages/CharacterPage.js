import React from 'react';
import { useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import { checkAccess } from '../common';
import './CharacterPage.scss';

export default function CharacterPage() {
    let { userId } = useParams();
    const { authorized, currentUserId } = checkAccess(userId);
    if (!authorized) {
        console.error('Trying to access unauthorized resource!');
        userId = currentUserId;
    }
    return (
        <>
            <Container>
                <h2>Personnage {userId}</h2>
                <ul>
                    <li>Voir</li>
                    <li>Editer</li>
                    <li>Imprimer en pdf</li>
                </ul>
            </Container>
        </>
    );
}