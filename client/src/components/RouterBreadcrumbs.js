import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Breadcrumbs, Typography } from '@mui/material';

export default function RouterBreadcrumbs(props) {
  const location = useLocation();
  const pathname = location.pathname;
  const isEdit = props.isEdit || pathname.includes('edit');
  const isView = pathname.includes('view');

  const getBreadcrumbName = () => {
    if (pathname.startsWith('/character-list')) {
      return 'Personnages';
    }
    if (pathname.startsWith('/character/user/')) {
      return isEdit
        ? 'Votre personnage (Édition)'
        : isView
          ? 'Votre personnage (Détails)'
          : 'Votre personnage';
    }
    if (pathname.startsWith('/character/')) {
      return isEdit
        ? 'Personnage (Édition)'
        : isView
          ? 'Personnage (Détails)'
          : 'Personnage';
    }
    if (pathname.startsWith('/user-list')) {
      return 'Utilisateurs';
    }
    if (pathname.startsWith('/user/')) {
      return isEdit
        ? 'Utilisateur (Édition)'
        : isView
          ? 'Profil (Détails)'
          : 'Profil';
    }
  };

  return (
    <>
      <br />
      <Breadcrumbs aria-label="breadcrumb">
        <RouterLink color="text.primary" to="/">
          <Typography color="text.primary">Accueil</Typography>
        </RouterLink>
        <Typography color="text.primary" key={pathname}>
          {getBreadcrumbName(pathname)}
        </Typography>
      </Breadcrumbs>
      <br />
    </>
  );
};