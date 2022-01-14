import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Typography, Grid } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ConfirmDialog } from '../components';

export default function UserList(props) {
    const { userList, deleteUser } = props;
    const [isOpen, setIsOpen] = useState(false);
    const [userId, setUserId] = useState(undefined);

    const handleClickOpen = (id) => {
        setUserId(id);
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setUserId(undefined);
    };

    const handleConfirmDelete = (id) => {
        if (id) {
            deleteUser(id);
        }
        setIsOpen(false);
    };

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xl={12}>
                    <Typography variant="h3">Liste des utilisateurs</Typography>
                </Grid>
                <Grid item xl={12}>
                    <Button color="primary" variant="outlined" component={Link} to="/user/0/edit" sx={{ mr: 2, height: 56 }}>
                        <FontAwesomeIcon icon={faPlus} size="lg" />
                    </Button>
                </Grid>
                <Grid item xl={12}>
                    <TableContainer component={Paper} variant="outlined">
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Prénom</TableCell>
                                    <TableCell>Nom</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Téléphone</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {userList?.map(user => (
                                    <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell>{user.user_firstname}</TableCell>
                                        <TableCell>{user.user_lastname}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.phone_number}</TableCell>
                                        <TableCell align="right">
                                            <Button component={Link} to={`/user/${user.id}/view`}>
                                                <FontAwesomeIcon icon={faEye} size="lg" />
                                            </Button>
                                            <Button component={Link} to={`/user/${user.id}/edit`}>
                                                <FontAwesomeIcon icon={faEdit} size="lg" />
                                            </Button>
                                            <Button onClick={() => handleClickOpen(user.id)}>
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
            <ConfirmDialog onConfirm={handleConfirmDelete} onClose={handleClose} isOpen={isOpen} id={userId}></ConfirmDialog>
        </>
    );
}