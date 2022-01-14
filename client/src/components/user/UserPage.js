import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Grid } from '@mui/material';

import { Error, Loading, User, ThemeContainer } from '../../components';
import { getCurrentUser } from '../../common';
import UserService from '../../services/User.service';

function createNewUser(id) {
    if (+id === 0) {
        return { id: 0, user_firstname: '', user_lastname: '', phone_number: '', email: '', user_password: '', is_admin: false };
    } else {
        return undefined;
    }
}

const UserPage = (props) => {
    const { id, action } = useParams();
    const { userId, isAdmin } = getCurrentUser();
    const [user, setUser] = useState(createNewUser(id));
    const [isEdit] = useState(action === 'edit' && isAdmin);
    const [isLoading, setIsLoading] = useState(false);
    const [isFound, setIsFound] = useState(undefined);
    const [errorMessage, setErrorMessage] = useState();

    useEffect(() => {
        const loadData = () => {
            setIsLoading(true);
            UserService
                .get(id)
                .then(response => {
                    setErrorMessage(response?.message);
                    if (response?.isSuccessful && (isAdmin || response?.data?.id === userId)) {
                        setIsFound(true);
                        setUser(response.data);
                    }
                    else if (response?.isSuccessful && !isAdmin && response?.data?.userId !== userId) {
                        setErrorMessage('Accès interdit');
                        console.error('Trying to access unauthorized resource!');
                        setIsFound(false);
                        setUser(undefined);
                    } else {
                        setIsFound(false);
                        setUser(undefined);
                    }
                })
                .finally(() => setIsLoading(false));
        };
        if (!isLoading && !user && isFound === undefined && id > 0) {
            loadData();
        } else {
            if (+id >= 0) {
                setIsFound(true);
            } else {
                setIsFound(false);
                setUser(undefined);
            }
        }
    }, [isLoading, id, user, userId, isFound, isAdmin]);

    return (
        <ThemeContainer>
            {isLoading
                ? <Loading />
                : (user && isFound === false)
                    ? <Alert severity="error">Aucun utilisateur avec l'id {id} existant.</Alert>
                    :
                    <Grid container spacing={2}>
                        <Grid item>
                            <User user={user} isEdit={isEdit} />
                        </Grid>
                    </Grid>
            }
            <Error errorMessage={errorMessage} />
        </ThemeContainer>
    );
}

export default UserPage;