import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Typography, Grid } from '@mui/material';

export default function CharacterList(props) {
    const [globalData] = useState(props.globalData);
    const { characterList, deleteCharacter, isCreateAllowed } = props;

    const handleDelete = (id) => {
        deleteCharacter(id);
    };

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xl={12}>
                    <Typography variant="h3">Liste des personnages</Typography>
                </Grid>
                <Grid item xl={12}>
                    {isCreateAllowed
                        ?
                        <Button component={Link} to="/character/0/edit" color="primary" variant="outlined">
                            Créer un personnage
                        </Button>
                        : null
                    }
                </Grid>
                <Grid item xl={12}>
                    <TableContainer component={Paper} variant="outlined">
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Personnage</TableCell>
                                    <TableCell>Propriétaire</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {characterList?.map(character => (
                                    <TableRow
                                        key={character.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {character.character_name}
                                        </TableCell>
                                        <TableCell>{character.user_id}</TableCell>
                                        <TableCell align="right">
                                            <Button component={Link} to={`/character/${character.id}/view`}>
                                                View
                                            </Button>
                                            <Button component={Link} to={`/character/${character.id}/edit`}>
                                                Edit
                                            </Button>
                                            <Button onClick={() => handleDelete(character.id)}>
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </>
    );
}