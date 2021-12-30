import React from 'react';

class Character extends React.Component {
    render() {
        const character = this.props;
        return (
            <div>
                <div>{character.userId}</div>
                <div>{character.characterName}</div>
            </div>
        );
    }
}

export default Character;