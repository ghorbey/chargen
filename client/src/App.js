import React from 'react';
import { Login, Navigation } from './components';
import useToken from './common/useToken';
import './scss/App.scss';
import isAdmin from './common/isAdmin';

export default function App() {
  const { token, setToken } = useToken();

  if (!token) {
    return <Login setToken={setToken} />
  }

  let pages = [
    { key: '1', name: 'Accueil', path: '/', requireAdmin: false },
    { key: '2', name: 'Liste des personnages', path: '/character-list', requireAdmin: true },
    { key: '3', name: 'Votre personnage', path: '/character', requireAdmin: false },
    { key: '4', name: 'Liste des utilisateurs', path: '/user-list', requireAdmin: true },
    { key: '5', name: 'Votre profil', path: '/user', requireAdmin: false },
    { key: '6', name: 'Vos préférences', path: '/preferences', requireAdmin: false }
  ];
  // Filter pages based on user type
  if (!isAdmin()) {
    pages = pages.filter(page => !page.requireAdmin);
  }

  return (
    <Navigation pages={pages} />
  );
}