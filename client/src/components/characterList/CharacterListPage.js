import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Error, Loading, CharacterList, ThemeContainer } from '../../components';
import { getCurrentUser, checkAccess } from '../../common';
import CharacterService from '../../services/Character.service';

export default function CharacterPage(props) {
    let { userId } = useParams();
    const { isAdmin } = getCurrentUser();
    const [characterList, setCharacterList] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const { authorized, currentUserId } = checkAccess(userId);

    if (!authorized) {
        console.error('Trying to access unauthorized resource!');
        userId = currentUserId;
    }

    const handleDelete = (id) => {
        if (id) {
            CharacterService
                .delete([id])
                .then(response => {
                    const { isSuccessful, message } = response;
                    if (isSuccessful) {
                        setCharacterList(characterList ? characterList.filter(character => character.id !== id) : characterList);
                    } else {
                        setErrorMessage(message);
                    }
                });
        }
    };

    useEffect(() => {
        const loadData = () => {
            if (!isLoading) {
                setIsLoading(true);
                CharacterService
                    .getAll()
                    .then(response => {
                        if (response.data) {
                            setCharacterList(response.data);
                        } else {
                            setCharacterList([]);
                        }
                    })
                    .finally(() => setIsLoading(false));
            }
        };

        if (!isLoading && !characterList) {
            loadData();
        }
    }, [isLoading, characterList, setIsLoading]);

    return (
        <ThemeContainer>
            {isLoading
                ? <Loading />
                : <CharacterList characterList={characterList} deleteCharacter={handleDelete} isCreateAllowed={isAdmin} />
            }
            <Error errorMessage={errorMessage} />
        </ThemeContainer>
    );
}