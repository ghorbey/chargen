import React from 'react';
import Container from '@mui/material/Container';
import './UserListPage.scss';

export default function UserListPage() {
    return (
        <>
            <Container>
                <h2>Liste des utilisateurs (Admin)</h2>
                <ul>
                    <li>Liste</li>
                    <li>Ajouter un utilisateur</li>
                    <li>Supprimer un utilisateur</li>
                    <li>Mettre à jour un utilisateur</li>
                </ul>
            </Container>
        </>
    );
}