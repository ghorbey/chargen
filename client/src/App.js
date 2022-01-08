import React from 'react';
import { Navigation } from './components';
import { LoginPage } from './pages';
import { useToken, getCurrentUser } from './common';
import './App.scss';

export default function App() {
  const { token, setToken } = useToken();
  const { isAdmin, userId } = getCurrentUser();

  if (!token) {
    return <LoginPage setToken={setToken} />
  }

  let pages = [
    { key: '1', name: 'Accueil', path: '/', access: ['everyone'] },
    { key: '2', name: 'Liste des personnages', path: '/character-list', access: ['admin'] },
    { key: '3', name: 'Votre personnage', path: `/character/${userId}`, access: ['pj'] },
    { key: '4', name: 'Votre personnage (PNJ)', path: `/character/${userId}`, access: ['admin'] },
    { key: '5', name: 'Liste des utilisateurs', path: '/user-list', access: ['admin'] },
    { key: '6', name: 'Votre profil', path: `/user/${userId}`, access: ['everyone'] },
    { key: '7', name: 'Vos préférences', path: `/preferences/${userId}`, access: ['everyone'] }
  ];

  // Filter pages based on user type
  pages = pages.filter(page => {
    if (page.access.includes('everyone')) {
      return true;
    } else if (page.access.includes('admin') && isAdmin) {
      return true;
    } else if (page.access.includes('pj') && !isAdmin) {
      return true;
    }
    return false;
  });

  return (
    <>
      <Navigation pages={pages} />
    </>
  );
}