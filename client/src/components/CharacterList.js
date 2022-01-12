import React from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Typography, Grid } from '@mui/material';
import { useData } from '../common';

export default function CharacterList(props) {
    const { globalData } = useData();
    const { characterList, deleteCharacter, isCreateAllowed } = props;

    const handleCreate = () => {
        <Navigate to='/character/0/edit' />;
    };

    const handleEdit = (id) => {
        if (id) {
            <Navigate to={`/character/${id}/edit`} />;
        }
    };

    const handleView = (id) => {
        if (id) {
            <Navigate to='/character/${id}/view' />
        }
    };

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
                        <Button color="primary" variant="outlined" onClick={handleCreate}>
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
                                            <Button onClick={() => handleView(character.id)}>
                                                View
                                            </Button>
                                            <Button onClick={() => handleEdit(character.id)}>
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