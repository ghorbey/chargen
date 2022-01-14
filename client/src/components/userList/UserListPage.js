import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { createTheme, ThemeProvider, Container, CssBaseline } from '@mui/material';

import { Error, Loading, UserList } from '../../components';
import { checkAccess } from '../../common';
import UserService from '../../services/User.service';

export default function UserListPage() {
    let { userId } = useParams();
    const [userList, setUserList] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const { authorized, currentUserId } = checkAccess(userId);
    const theme = createTheme();

    if (!authorized) {
        console.error('Trying to access unauthorized resource!');
        userId = currentUserId;
    }

    const handleDelete = (id) => {
        if (id) {
            UserService
                .delete([id])
                .then(response => {
                    const { isSuccessful, message } = response;
                    if (isSuccessful) {
                        setUserList(userList ? userList.filter(user => user.id !== id) : userList);
                    } else {
                        setErrorMessage(message);
                    }
                });
        }
    };

    useEffect(() => {
        const loadData = () => {
            if (!isLoading) {
                setIsLoading(true);
                UserService
                    .getAll()
                    .then(response => {
                        if (response.data) {
                            setUserList(response.data);
                        } else {
                            setUserList([]);
                        }
                    })
                    .finally(() => setIsLoading(false));
            }
        };

        if (!isLoading && !userList) {
            loadData();
        }
    }, [isLoading, userList, setIsLoading]);

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="lg">
                <CssBaseline />
                {isLoading
                    ? <Loading />
                    : <UserList userList={userList} deleteUser={handleDelete} />
                }
                <Error errorMessage={errorMessage} />
            </Container>
        </ThemeProvider>
    );
}