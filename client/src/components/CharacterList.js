import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Typography } from '@mui/material';
import { CreateCharacterButton } from '../components';

export default function CharacterList(props) {
    const { characterList, create, deleteCharacter, isCreateAllowed } = props;
    const navigate = useNavigate();

    const handleEdit = (id) => {
        if (id) {
            navigate(`/character/${id}/edit`);
        }
    };

    const handleDelete = (id) => {
        deleteCharacter(id);
    };

    const handleView = (id) => {
        if (id) {
            navigate(`/character/${id}/view`);
        }
    };


    return (
        <>
            <Typography variant="h3">Liste des personnages</Typography>
            <CreateCharacterButton create={create} isVisible={isCreateAllowed} />
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
        </>
    );
}