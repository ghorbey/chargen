import React, { useState, useEffect } from 'react';
import { Grid, Typography, Stack, Button, FormControl, TextField } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';


export default function MultipleTextArea(props) {
    const { data, title, id, isDisabled, blankItem, label, name } = props;
    const [editedData, setEditedData] = useState();

    if (data?.length === 0 && blankItem) {
        const newItem = Object.assign({}, blankItem);
        newItem.id = 0;
        newItem.character_id = id;
        data.push(newItem);
    }

    const removeEntry = (id) => {
        console.log(`Remove ${id}`);
    };

    const addEntry = () => {
        console.log(`Add entry`);
    };

    const updateContent = (field, value) => {
        const copy = { ...editedData };
        if (field) {
            const splitKey = field.split('_');
            if (splitKey?.length > 1) {
                const found = editedData.find(entry => entry.id.toString() === splitKey[splitKey.length - 1].toString());
                if (found) {
                    found.content = value;
                    setEditedData(copy);
                    console.log(editedData);
                    //call update methodé
                }
            }
        }
    };

    useEffect(() => {
        if (!editedData && data?.length > 0) {
            const dataCopy = data.map(entry => {
                const newEntry = {};
                Object.keys(entry).forEach(property => newEntry[property] = entry[property]);
                return newEntry;
            });
            setEditedData(dataCopy);
        }
    }, [data, editedData]);

    return (
        (id >= 0)
            ? <>
                <Grid container id={id}>
                    <Grid item lg={1} sx={{ displayPrint: 'none' }}>
                        <Button color="primary" variant="outlined" onClick={(e) => addEntry()} disabled={isDisabled || (editedData?.length > 0 && !editedData[0].content)} sx={{ mt: 2, height: 56 }}>
                            <FontAwesomeIcon icon={faPlus} size="lg" />
                        </Button>
                    </Grid>
                    <Grid item lg={11}>
                        <Typography variant="list_header" color="text.primary">{title}</Typography>
                    </Grid>
                    {(editedData?.length > 0)
                        ? editedData.map(entry =>
                            <Grid container key={`${name}_${entry.id}`}>
                                <Grid item lg={11}>
                                    <FormControl fullWidth>
                                        <TextField
                                            id={`${name}_${entry.id}`}
                                            margin="normal"
                                            label={`${label} ${entry.id + 1}`}
                                            name={`${name}_${entry.id}`}
                                            InputLabelProps={{ shrink: true }}
                                            disabled={isDisabled}
                                            fullWidth
                                            value={entry.content}
                                            onChange={(e) => updateContent(e.target.name, e.target.value)}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={1} sx={{ displayPrint: 'none' }}>
                                    <Stack direction="row" justifyContent="flex-end">
                                        <Button color="primary" variant="outlined" onClick={(e) => removeEntry(entry.id)} disabled={isDisabled || entry.id === 0} sx={{ mt: 2, height: 56 }}>
                                            <FontAwesomeIcon icon={faMinus} size="lg" />
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        )
                        : ''}
                </Grid>
            </>
            : ''
    );
}