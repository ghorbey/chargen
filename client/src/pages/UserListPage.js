import React from 'react';

import './UserListPage.scss';

class UserListPage extends React.Component {
    render() {
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
}

export default UserListPage;