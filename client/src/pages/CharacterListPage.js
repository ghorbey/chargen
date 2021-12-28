import React from 'react';

import './CharacterListPage.scss';

class CharacterListPage extends React.Component {
    render() {
        return (
            <div>
                <h2>Liste des personnages (Admin)</h2>
                <ul>
                    <li>Liste</li>
                    <li>Ajouter un personnage</li>
                    <li>Supprimer un personnage</li>
                    <li>Mettre à jour un personnage</li>
                    <li>Afficher le lien avec un utilisateur</li>
                </ul>
            </div>
        );
    }
}

export default CharacterListPage;