import React from 'react';

import './UserPage.scss';

class UserPage extends React.Component {
    render() {
        return (
            <div>
                <h2>Utilisateur (Admin)</h2>
                <ul>
                    <li>Mettre à jour l' utilisateur</li>
                    <li>Lien entre un utilisateur et un personnage</li>
                    <li>Statut Admin</li>
                    <li>Nom, prénom, téléphone, email, mot de passe, ...</li>
                </ul>
            </div>
        );
    }
}

export default UserPage;