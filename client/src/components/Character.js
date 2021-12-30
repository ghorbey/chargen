import React from 'react';

class Character extends React.Component {
    render() {
        const character = this.props;
        return (
            <div>
                <div>{character.userid}</div>
                <div>{character.name}</div>
            </div>
        );
    }
}

export default Character;