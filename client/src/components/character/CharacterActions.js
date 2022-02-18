import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import { Link } from 'react-router-dom';
import { Button, Grid } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faArrowLeft, faSave, faBan, faFilePdf } from '@fortawesome/free-solid-svg-icons';

import { Error } from '..';
import { getCurrentUser } from '../../common';
import { PrintCharacter } from '../../components';

export const CharacterActions = (props) => {
    const { errorMessage, isEdit, handleSave, handleEdit, handlePrint, handleCancel, character, globalData } = props;
    const { isAdmin, isPnj } = getCurrentUser();
    const componentRef = useRef();

    return (
        <Grid container spacing={2} sx={{ displayPrint: 'none' }}>
            <Grid item xl={12}>
                {!isEdit && (isAdmin || isPnj)
                    ? <Button color="primary" variant="outlined" component={Link} to={(isAdmin || isPnj) ? '/character-list' : '/character/user/view'} sx={{ mr: 2, height: 56 }}>
                        <FontAwesomeIcon icon={faArrowLeft} size="lg" />
                    </Button>
                    : null
                }
                {isEdit && (isAdmin || isPnj)
                    ? <Button color="primary" variant="outlined" onClick={() => handleCancel()} sx={{ mr: 2, height: 56 }}>
                        <FontAwesomeIcon icon={faBan} size="lg" />
                    </Button>
                    : null
                }
                <Button color="primary" variant="outlined" onClick={isEdit ? () => handleSave() : () => handleEdit()} sx={{ mr: 2, height: 56 }}>
                    {!isEdit ? <FontAwesomeIcon icon={faEdit} size="lg" /> : <FontAwesomeIcon icon={faSave} size="lg" />}
                </Button>
                {!isEdit
                    ? <>
                        <ReactToPrint trigger={
                            () =>
                                <Button color="primary" variant="outlined" onClick={() => handlePrint()} sx={{ mr: 2, height: 56 }}>
                                    <FontAwesomeIcon icon={faFilePdf} size="lg" />
                                </Button>}
                            content={() => componentRef.current}
                        />
                        <PrintCharacter ref={componentRef} globalData={globalData} character={character} />
                    </>
                    : null
                }
            </Grid>
            <Grid item xl={12}>
                <Error errorMessage={errorMessage} />
            </Grid>
        </Grid>
    );
}