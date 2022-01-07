import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import CharacterService from '../services/Character.service';
import { CharacterList } from '../components';
import './CharacterListPage.scss';

export default function CharacterListPage() {
    const [characters, setCharacters] = useState([]);

    useEffect(() => {
        CharacterService
            .getAll()
            .then(response => {
                setCharacters(response.data);
            });
    }, [])

    return (
        <>
            <Container>
                <h2>Liste des personnages (Admin)</h2>
                <CharacterList characters={characters} />
                <ul>
                    <li>Ajouter un personnage</li>
                    <li>Supprimer un personnage</li>
                    <li>Mettre à jour un personnage</li>
                    <li>Afficher le lien avec un utilisateur</li>
                </ul>
            </Container>
        </>
    );
}