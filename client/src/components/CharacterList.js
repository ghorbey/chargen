import React from 'react';
import Character from './Character';

export default function CharacterList(props) {
    const characters = props.characters;
    return (
        <div>
            {characters.map(character => <Character key={character.id} {...character} />)}
        </div>
    );
}