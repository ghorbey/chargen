import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Typography, Grid } from '@mui/material';

export default function UserList(props) {
    const [globalData] = useState(props.globalData);
    const { userList, deleteUser } = props;

    const handleDelete = (id) => {
        deleteUser(id);
    };

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xl={12}>
                    <Typography variant="h3">Liste des utilisateurs</Typography>
                </Grid>
                <Grid item xl={12}>
                    <Button component={Link} to="/user/0/edit" color="primary" variant="outlined">
                        Créer un utilisateur
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
                                    <TableRow
                                        key={user.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell>{user.user_firstname}</TableCell>
                                        <TableCell>{user.user_lastname}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.phone_number}</TableCell>
                                        <TableCell align="right">
                                            <Button component={Link} to={`/user/${user.id}/view`}>View</Button>
                                            <Button component={Link} to={`/user/${user.id}/edit`}>Edit</Button>
                                            <Button onClick={() => handleDelete(user.id)}>Delete</Button>
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