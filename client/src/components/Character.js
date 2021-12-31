import React from 'react';

export default function Character(props) {
    const character = props;
    return (
        <div>
            <div>{character.user_id}</div>
            <div>{character.character_name}</div>
        </div>
    );
}