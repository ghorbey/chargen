import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import sha256 from 'crypto-js/sha256';
import { Button, Alert, Grid, TextField, FormControlLabel, Checkbox, FormControl } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faArrowLeft, faSave, faBan } from '@fortawesome/free-solid-svg-icons';

import { Error } from '../../components';
import { getCurrentUser } from '../../common';
import UserService from '../../services/User.service';

export default function User(props) {
    const [isEdit, setIsEdit] = useState(props.isEdit);
    const [user, setUser] = useState(props.user);
    const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const navigate = useNavigate();
    const { isAdmin } = getCurrentUser();

    const handleSave = (isPasswordUpdated) => {
        setIsEdit(false);
        if (user) {
            const toSave = { ...user };
            if (isPasswordUpdated) {
                toSave.user_password = sha256(user.user_password).toString();
            }
            if (user.id) {
                UserService
                    .update([toSave])
                    .then(response => {
                        const { isSuccessful, message } = response;
                        if (isSuccessful) {
                            setIsEdit(false);
                            setIsPasswordUpdated(false);
                            const copy = { ...user };
                            copy.user_password = '';
                            setUser(copy);
                        }
                        setErrorMessage(message);
                    });
            } else {
                user.user_password =
                    UserService
                        .add([toSave])
                        .then(response => {
                            const { isSuccessful, message } = response;
                            if (isSuccessful) {
                                setIsEdit(false);
                                setIsPasswordUpdated(false);
                                const copy = { ...user };
                                copy.user_password = '';
                                setUser(copy);
                            }
                            setErrorMessage(message);
                        });
            }
        }
    };

    const updateField = (field, value) => {
        const copy = { ...user };
        copy[field] = value;
        setUser(copy);
    };

    const updatePassword = (field, value) => {
        setIsPasswordUpdated(true);
        updateField(field, value);
    }

    const handleCancel = () => {
        if (user?.id) {
            setUser(props.user);
            setIsEdit(false);
        } else {
            navigate('/user-list');
        }
    };

    const handleEdit = () => {
        setIsEdit(true);
    };

    return (
        (user) ?
            <>
                <Grid container spacing={2}>
                    <Grid item xl={12}>
                        {!isEdit
                            ? <Button color="primary" variant="outlined" component={Link} to={'/user-list'} sx={{ mr: 2, height: 56 }}>
                                <FontAwesomeIcon icon={faArrowLeft} size="lg" />
                            </Button>
                            : null
                        }
                        {isEdit
                            ? <Button color="primary" variant="outlined" onClick={handleCancel} sx={{ mr: 2, height: 56 }}>
                                <FontAwesomeIcon icon={faBan} size="lg" />
                            </Button>
                            : null
                        }
                        <Button color="primary" variant="outlined" onClick={isEdit ? () => handleSave(isPasswordUpdated) : handleEdit} sx={{ mr: 2, height: 56 }}>
                            {!isEdit ? <FontAwesomeIcon icon={faEdit} size="lg" /> : <FontAwesomeIcon icon={faSave} size="lg" />}
                        </Button>
                    </Grid>
                    <Grid item xl={12}>
                        <Error errorMessage={errorMessage} />
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item lg={6}>
                        <FormControl fullWidth>
                            <TextField
                                id="user_firstname"
                                margin="normal"
                                label="Prénom"
                                name="user_firstname"
                                InputLabelProps={{ shrink: true }}
                                type="string"
                                autoComplete="off"
                                disabled={!isEdit || !isAdmin}
                                value={user.user_firstname}
                                onChange={(e) => updateField(e.target.name, e.target.value)}
                                autoFocus
                                fullWidth
                                required
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={6}>
                        <FormControl fullWidth>
                            <TextField
                                id="user_lastname"
                                margin="normal"
                                label="Nom"
                                name="user_lastname"
                                InputLabelProps={{ shrink: true }}
                                type="string"
                                autoComplete="off"
                                disabled={!isEdit || !isAdmin}
                                value={user.user_lastname}
                                onChange={(e) => updateField(e.target.name, e.target.value)}
                                fullWidth
                                required
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={6}>
                        <FormControl fullWidth>
                            <TextField
                                id="email"
                                margin="normal"
                                label="Email"
                                name="email"
                                InputLabelProps={{ shrink: true }}
                                type="string"
                                autoComplete="off"
                                disabled={!isEdit}
                                value={user.email}
                                onChange={(e) => updateField(e.target.name, e.target.value)}
                                fullWidth
                                required
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={6}>
                        <FormControl fullWidth>
                            <TextField
                                id="phone_number"
                                margin="normal"
                                label="Téléphone"
                                name="phone_number"
                                InputLabelProps={{ shrink: true }}
                                type="string"
                                autoComplete="off"
                                disabled={!isEdit}
                                value={user.phone_number}
                                onChange={(e) => updateField(e.target.name, e.target.value)}
                                fullWidth
                                required
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={6}>
                        <FormControl fullWidth>
                            <TextField
                                id="user_password"
                                margin="normal"
                                label="Mot de passe"
                                name="user_password"
                                InputLabelProps={{ shrink: true }}
                                type="password"
                                autoComplete="off"
                                disabled={!isEdit}
                                value={user.user_password}
                                onChange={(e) => updatePassword(e.target.name, e.target.value)}
                                fullWidth
                                required
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={3}>
                        <FormControlLabel control={<Checkbox id="is_admin" name="is_admin" checked={user.is_admin} disabled={!isEdit || !isAdmin} onChange={(e) => updateField(e.target.name, e.target.checked)} />} label="Admin?" sx={{ mt: 3 }} />
                    </Grid>
                    <Grid item lg={3}>
                        <FormControlLabel control={<Checkbox id="is_pnj" name="is_pnj" checked={user.is_pnj} disabled={!isEdit || !isAdmin} onChange={(e) => updateField(e.target.name, e.target.checked)} />} label="PNJ?" sx={{ mt: 3 }} />
                    </Grid>
                </Grid>
            </>
            : (errorMessage)
                ? <Alert severity="information">{errorMessage}</Alert>
                : null
    );
}