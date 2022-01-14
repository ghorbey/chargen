import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Typography, Grid } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ConfirmDialog } from '../components';

export default function CharacterList(props) {
    const { characterList, deleteCharacter, isCreateAllowed } = props;
    const [isOpen, setIsOpen] = useState(false);
    const [characterId, setCharacterId] = useState(undefined);

    const handleClickOpen = (id) => {
        setCharacterId(id);
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setCharacterId(undefined);
    };

    const handleConfirmDelete = (id) => {
        if (id) {
            deleteCharacter(id);
        }
        setIsOpen(false);
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
                        <Button color="primary" variant="outlined" component={Link} to="/character/0/edit" sx={{ mr: 2, height: 56 }}>
                            <FontAwesomeIcon icon={faPlus} size="lg" />
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
                                    <TableRow key={character.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">{character.character_name}</TableCell>
                                        <TableCell>{character.user_id}</TableCell>
                                        <TableCell align="right">
                                            <Button component={Link} to={`/character/${character.id}/view`}>
                                                <FontAwesomeIcon icon={faEye} size="lg" />
                                            </Button>
                                            <Button component={Link} to={`/character/${character.id}/edit`}>
                                                <FontAwesomeIcon icon={faEdit} size="lg" />
                                            </Button>
                                            <Button onClick={() => handleClickOpen(character.id)}>
                                                <FontAwesomeIcon icon={faTrash} size="lg" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
            <ConfirmDialog onConfirm={handleConfirmDelete} onClose={handleClose} isOpen={isOpen} id={characterId}></ConfirmDialog>
        </>
    );
}