import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import { CharacterListPage, CharacterPage, HomePage, PreferencesPage, UserListPage, UserPage } from './pages';
import { Header, Login } from './components';
import useToken from './common/useToken';

import './scss/App.scss';

export default function App() {
  const { token, setToken } = useToken();
  console.log(`Token: ${token}`);

  if (!token) {
    return <Login setToken={setToken} />
  }

  return (
    <Container fluid>
      <h1>Les Principautés Frontalière - Le jeu de rôle grandeur nature</h1>
      <Router>
        <div>
          <Header />
          <hr />
          <Routes>
            <Route exact path='/' element={<HomePage />} />
            <Route path='/character-list' element={<CharacterListPage />} />
            <Route path='/character' element={<CharacterPage />} />
            <Route path='/user-list' element={<UserListPage />} />
            <Route path='/user' element={<UserPage />} />
            <Route path='/preferences' element={<PreferencesPage />} />
          </Routes>
        </div>
      </Router>
    </Container>
  );
}