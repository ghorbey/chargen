import React, { useEffect, useState } from 'react';
import { createTheme, Container, ThemeProvider, CssBaseline } from '@mui/material';
import CharacterService from '../services/Character.service';
import { CharacterList } from '../components';
import './CharacterListPage.scss';

export default function CharacterListPage() {
    const [characters, setCharacters] = useState([]);
    const theme = createTheme();

    useEffect(() => {
        CharacterService
            .getAll()
            .then(response => {
                setCharacters(response.data);
            });
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <h2>Liste des personnages (Admin)</h2>
                <CharacterList characters={characters} />
                <ul>
                    <li>Ajouter un personnage</li>
                    <li>Supprimer un personnage</li>
                    <li>Mettre à jour un personnage</li>
                    <li>Afficher le lien avec un utilisateur</li>
                </ul>
            </Container>
        </ThemeProvider>
    );
}