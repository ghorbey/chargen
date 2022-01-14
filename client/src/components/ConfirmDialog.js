import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export default function ConfirmDialog(props) {
    const { id, onConfirm, onClose, isOpen } = props;

    return (
        (isOpen) ?
            <Dialog open={isOpen}
                onClose={onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirmation de suppression d'un élément"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Voulez-vous vraiment supprimer cet élément?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>
                        Annuler
                    </Button>
                    <Button onClick={() => onConfirm(id)} autoFocus>
                        Confirmer
                    </Button>
                </DialogActions>
            </Dialog>
            : null
    );
}