import React from 'react';

import { Character } from './';

class CharacterList extends React.Component {
    render() {
        console.log(this.props);
        return (
            <div>
                {this.props.length}{this.props.characters.map(character => <Character key={character.id} {...character} />)}
            </div>
        );
    }
}

export default CharacterList;