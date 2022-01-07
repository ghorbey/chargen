import React from 'react';
import Container from '@mui/material/Container';
import './UserPage.scss';

export default function UserPage() {
    return (
        <>
            <Container>
                <h2>Utilisateur (Admin)</h2>
                <ul>
                    <li>Mettre à jour l' utilisateur</li>
                    <li>Lien entre un utilisateur et un personnage</li>
                    <li>Statut Admin</li>
                    <li>Nom, prénom, téléphone, email, mot de passe, ...</li>
                </ul>
            </Container>
        </>
    );
}