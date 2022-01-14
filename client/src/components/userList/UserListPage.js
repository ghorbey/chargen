import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Error, Loading, UserList, ThemeContainer } from '../../components';
import { checkAccess } from '../../common';
import UserService from '../../services/User.service';

export default function UserListPage() {
    let { userId } = useParams();
    const [userList, setUserList] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const { authorized, currentUserId } = checkAccess(userId);

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
        <ThemeContainer>
            {isLoading
                ? <Loading />
                : <UserList userList={userList} deleteUser={handleDelete} />
            }
            <Error errorMessage={errorMessage} />
        </ThemeContainer>
    );
}