import React from 'react';

import './CharacterPage.scss';

class CharacterPage extends React.Component {
    render() {
        return (
            <div>
                <h2>Personnage</h2>
                <ul>
                    <li>Voir</li>
                    <li>Editer</li>
                    <li>Imprimer en pdf</li>
                </ul>
            </div>
        );
    }
}

export default CharacterPage;