import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/system';
import { Checkbox } from '@mui/material';

import { getCurrentUser } from '../../common';
import { ThemeContainer } from '../../components';
import CharacterService from '../../services/Character.service';

export default function PrintCharacter(props) {
    const globalData = props.globalData;
    const { id } = useParams();
    const { userId, isAdmin, IsPnj } = getCurrentUser();
    const [character, setCharacter] = useState(undefined);

    const grey = {
        50: '#F3F6F9',
        100: '#E7EBF0',
        200: '#E0E3E7',
        300: '#CDD2D7',
        400: '#B2BAC2',
        500: '#A0AAB4',
        600: '#6F7E8C',
        700: '#3E5060',
        800: '#2D3843',
        900: '#1A2027',
    };

    const Root = styled('div')(
        ({ theme }) => `table {
            border-collapse: separate;
            border: 1px solid ${grey[300]};
            border-radius: 5px;
            font-family: IBM Plex Sans, sans-serif;
            font-size: 0.875rem;
            width: 100%;
        }
      
        td,
        th {
            text-align: left;
            padding: 6px;
            border-top: none;
        }
      
        th {
            background-color: ${grey[50]};
            white-space: nowrap;
        }
        
        td:first-of-type, th:first-of-type {
            border-left: none;
        }
        
        td > span {
            padding: 0;
        }`
    );

    useEffect(() => {
        if (!character && globalData && id > 0) {
            CharacterService
                .get(id)
                .then(response => {
                    if (response?.isSuccessful) {
                        if (response?.data?.user_id === userId || isAdmin || IsPnj) {
                            if (response.data) {
                                const character = response.data;
                                const user = globalData.users.find(user => user.id === response.data.user_id);
                                character.name = `${character.character_name} (${user.user_firstname} ${user.user_lastname} - ${character.character_type})`;
                                const foundOrigin = globalData.countries.find(country => country.id === response.data.country_id);
                                character.origin = foundOrigin.country_name;
                                const foundRace = globalData.races.find(race => race.id === response.data.race_id);
                                character.race = foundRace.race_name;
                                const foundReligion = globalData.religions.find(religion => religion.id === response.data.religion_id);
                                character.religion = foundReligion.religion_name;
                                setCharacter(character);
                            }
                        }
                    }
                });
        }
    }, [userId, id, character, isAdmin, IsPnj, globalData]);

    return (
        (character && globalData) ?
            <ThemeContainer>
                <Root sx={{ maxWidth: '100%' }}>
                    <table aria-label="character for print">
                        <tbody>
                            <tr>
                                <th>Nom :</th>
                                <td>{character.name}</td>
                                <th>Numéro :</th>
                                <td>{character.character_number}</td>
                                <th>Points de destin :</th>
                                <td>2</td>
                            </tr>
                            <tr>
                                <th>Origine :</th>
                                <td>{character.origin}</td>
                                <th>Race :</th>
                                <td>{character.race}</td>
                                <th>Religion :</th>
                                <td>{character.religion}</td>
                            </tr>
                            <tr>
                                <th>Vocation :</th>
                                <td></td>
                                <th>Carrière :</th>
                                <td></td>
                                <th>Historique :</th>
                                <td></td>
                            </tr>
                            <tr>
                                <th>Compétences :</th>
                                <td colSpan="5"></td>
                            </tr>
                            <tr>
                                <th>XP actuels :</th>
                                <td colSpan="2">{character.current_xp}</td>
                                <th>XP totaux :</th>
                                <td colSpan="2">{character.total_xp}</td>
                            </tr>
                            <tr>
                                <th>XP scénario :</th>
                                <td colSpan="2"><Checkbox disabled /></td>
                                <th>XP roleplay :</th>
                                <td colSpan="2"><Checkbox disabled /></td>
                            </tr>
                            <tr>
                                <th>Quête:</th>
                                <td colSpan="5">blabla</td>
                            </tr>
                            <tr>
                                <th>Légende publique:</th>
                                <td colSpan="5">blabla</td>
                            </tr>
                            <tr>
                                <th>Background:</th>
                                <td colSpan="5">blabla</td>
                            </tr>
                            <tr>
                                <th>Chapitres</th>
                                <td colSpan="5">blabla</td>
                            </tr>
                            <tr>
                                <th>Annexes:</th>
                                <td colSpan="5">blabla</td>
                            </tr>
                        </tbody>
                    </table>
                </Root>
            </ThemeContainer>
            : <></>
    );
}