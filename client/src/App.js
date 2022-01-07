import React from 'react';
import { Login, Navigation } from './components';
import useToken from './common/useToken';
import './scss/App.scss';

export default function App() {
  const { token, setToken } = useToken();

  if (!token) {
    return <Login setToken={setToken} />
  }

  const pages = [
    { key: '1', name: 'Accueil', path: '/' },
    { key: '2', name: 'Liste des personnages', path: '/character-list' },
    { key: '3', name: 'Votre personnage', path: '/character' },
    { key: '4', name: 'Liste des utilisateurs', path: '/user-list' },
    { key: '5', name: 'Votre profil', path: '/user' },
    { key: '6', name: 'Vos préférences', path: '/preferences' }
  ];
  // Filter pages based on user type
  const displayedPages = pages;

  return (
    <Navigation pages={displayedPages} />
  );
}