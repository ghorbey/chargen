import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faArrowLeft, faSave, faBan, faFilePdf } from '@fortawesome/free-solid-svg-icons';

import { Error } from '..';
import { getCurrentUser } from '../../common';

export default function CharacterActions(props) {
    const { errorMessage, isEdit, handlePrint, handleSave, handleEdit, handleCancel } = props;
    const { isAdmin } = getCurrentUser();

    return (
        <Grid container spacing={2}>
            <Grid item xl={12}>
                {!isEdit && isAdmin
                    ? <Button color="primary" variant="outlined" component={Link} to={isAdmin ? '/character-list' : '/character/user/view'} sx={{ mr: 2, height: 56 }}>
                        <FontAwesomeIcon icon={faArrowLeft} size="lg" />
                    </Button>
                    : null
                }
                {isEdit
                    ? <Button color="primary" variant="outlined" onClick={() => handleCancel()} sx={{ mr: 2, height: 56 }}>
                        <FontAwesomeIcon icon={faBan} size="lg" />
                    </Button>
                    : null
                }
                <Button color="primary" variant="outlined" onClick={isEdit ? () => handleSave() : () => handleEdit()} sx={{ mr: 2, height: 56 }}>
                    {!isEdit ? <FontAwesomeIcon icon={faEdit} size="lg" /> : <FontAwesomeIcon icon={faSave} size="lg" />}
                </Button>
                {!isEdit
                    ? <Button color="primary" variant="outlined" onClick={() => handlePrint()} sx={{ mr: 2, height: 56 }}>
                        <FontAwesomeIcon icon={faFilePdf} size="lg" />
                    </Button>
                    : null
                }
            </Grid>
            <Grid item xl={12}>
                <Error errorMessage={errorMessage} />
            </Grid>
        </Grid>
    );
}