import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import PropTypes from 'prop-types';
import { createTheme, ThemeProvider, Container, CssBaseline, Alert, Button, Grid, Typography } from '@mui/material';
import CharacterService from '../services/Character.service';
import { Error, Loading, Character } from '../components';
import { getCurrentUser } from '../common';

function createNewCharacter(id, userId) {
    if (+id === 0) {
        return { id: 0, user_id: +userId, character_name: '', character_type: 'pj', character_number: '000', fate_points: 2, country_id: 1, race_id: 1, religion_id: 1, vocation_id: 1, current_xp: 0, total_xp: 0, public_legend: '', background: '' };
    } else {
        return undefined;
    }
}

export default function CharacterPage(props) {
    const { id, action } = useParams();
    const navigate = useNavigate();
    const { userId, isAdmin } = getCurrentUser();
    const [character, setCharacter] = useState(createNewCharacter(id, userId));
    const [isEdit] = useState(action === 'edit');
    const [isLoading, setIsLoading] = useState(false);
    const [isFound, setIsFound] = useState(undefined);
    const [errorMessage] = useState();
    const theme = createTheme();

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current
    });

    useEffect(() => {
        const loadData = () => {
            if (!isLoading && id > 0) {
                setIsLoading(true);
                CharacterService
                    .get(id)
                    .then(response => {
                        if (response.data) {
                            if (response.data.user_id === userId || isAdmin) {
                                setIsFound(true);
                                setCharacter(response.data);
                            } else {
                                console.error('Trying to access unauthorized resource!');
                                navigate('/');
                            }
                        } else {
                            setIsFound(false);
                            setCharacter(undefined);
                        }
                    })
                    .finally(() => setIsLoading(false));
            } else {
                setIsFound(false);
                setCharacter(undefined);
            }
        };
        if (!isLoading && !character && isFound === undefined && id >= 0) {
            loadData();
        }
    }, [isLoading, userId, id, character, isFound, isAdmin, setCharacter, navigate]);

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="lg">
                <CssBaseline />
                {isLoading
                    ? <Loading />
                    : isFound === false
                        ?
                        <Alert severity="error">Aucun personnage avec l'id {id} existant.</Alert>
                        :
                        <Grid container spacing={2}>
                            {character ?
                                <Grid item lg={!isEdit ? 10 : 12}>
                                    <Typography>{character.character_name}</Typography>
                                </Grid>
                                : null
                            }
                            {!isEdit
                                ?
                                <Grid item lg={2}>
                                    <Button color="primary" variant="outlined" onClick={handlePrint}>Print to pdf</Button>
                                </Grid>
                                : null
                            }
                            <Grid item>
                                <Character ref={componentRef} character={character} isEdit={isEdit} />
                            </Grid>
                        </Grid>
                }
                <Error errorMessage={errorMessage} />
            </Container>
        </ThemeProvider>
    );
}

CharacterPage.propTypes = {
    id: PropTypes.number,
    action: PropTypes.string
}