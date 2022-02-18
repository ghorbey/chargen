import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import { CharacterPage, CharacterListPage, HomePage, PageNotFound, UserListPage, UserPage, LoginPage, PrintCharacter } from '../components';
import { getCurrentUser } from '../common';
import DataService from '../services/Data.service';

export default function Navigation(props) {
    const { token, setToken } = props;
    const [globalData, setGlobalData] = useState(undefined);
    const { userId } = getCurrentUser();

    useEffect(() => {
        const loadData = () => {
            DataService
                .getAll()
                .then(response => {
                    if (response?.isSuccessful) {
                        setGlobalData(response.data);
                    } else {
                        setGlobalData({});
                    }
                });
        };
        if (userId) {
            loadData();
        }
    }, [userId]);

    return (
        <Routes>
            {(!token)
                ? <Route exact path='*' element={<LoginPage setToken={setToken} />} />
                : <>
                    <Route path='/' element={<HomePage />} />
                    <Route path='character-list' element={<CharacterListPage globalData={globalData} />} />
                    <Route path='character/:id/:action' element={<CharacterPage globalData={globalData} />} />
                    <Route path='user-list' element={<UserListPage />} />
                    <Route path='user/:id/:action' element={<UserPage />} />
                    <Route path='logout' element={<HomePage />} />
                    <Route path='character/:id/print-preview' element={<PrintCharacter globalData={globalData} />} />
                    <Route element={PageNotFound} />
                </>
            }
        </Routes>
    );
}