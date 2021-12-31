import React from 'react';
import './UserListPage.scss';

export default function UserListPage() {
    return (
        <div>
            <h2>Liste des utilisateurs (Admin)</h2>
            <ul>
                <li>Liste</li>
                <li>Ajouter un utilisateur</li>
                <li>Supprimer un utilisateur</li>
                <li>Mettre à jour un utilisateur</li>
            </ul>
        </div>
    );
}