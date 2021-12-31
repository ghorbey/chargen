import React from 'react';
import Character from './Character';

export default function CharacterList(props) {
    return (
        <div>
            {props.length}{props.characters.map(character => <Character key={character.id} {...character} />)}
        </div>
    );
}