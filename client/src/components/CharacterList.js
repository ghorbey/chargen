import React from 'react';
import Character from './Character';

export default function CharacterList(props) {
    const characters = props.characters;
    return (
        <>
            {characters.map(character => <Character key={character.id} {...character} />)}
        </>
    );
}