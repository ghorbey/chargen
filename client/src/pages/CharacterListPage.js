import React from 'react';

import CharacterService from '../services/Character.service';
import { CharacterList } from '../components';
import './CharacterListPage.scss';

class CharacterListPage extends React.Component {
    state = {
        characters: []
    }

    componentDidMount() {
        this.refresh();
    }

    refresh() {
        // Fake data
        //this.setState({ characters: fakeData });
        CharacterService
            .getAll()
            .then(response => {
                this.setState({ characters: response.data });
            });
    }

    render() {
        return (
            <div>
                <h2>Liste des personnages (Admin)</h2>
                <CharacterList characters={this.state.characters} />
                <ul>
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