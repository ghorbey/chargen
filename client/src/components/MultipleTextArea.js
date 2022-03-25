import React from 'react';
import { Grid, Typography, Stack, Button, FormControl, TextField } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';


export default function MultipleTextArea(props) {
    const { data, title, id, isDisabled, label, name, updateContent, addEntry, removeEntry } = props;

    return (
        (id >= 0)
            ? <>
                <Grid container id={id}>
                    <Grid item lg={1} sx={{ displayPrint: 'none' }}>
                        <Button color="primary" variant="outlined" onClick={(e) => addEntry()} disabled={isDisabled} sx={{ mt: 2, height: 56 }}>
                            <FontAwesomeIcon icon={faPlus} size="lg" />
                        </Button>
                    </Grid>
                    <Grid item lg={11}>
                        <Typography variant="list_header" color="text.primary">{title}</Typography>
                    </Grid>
                    {(data?.length > 0)
                        ? data.map((entry, index) =>
                            <Grid container key={`${name}_${entry.id}`}>
                                <Grid item lg={11}>
                                    <FormControl fullWidth>
                                        <TextField id={`${name}_${index}`} margin="normal" label={`${label} ${index + 1}`} name={`${name}_${index}`} InputLabelProps={{ shrink: true }} disabled={isDisabled} autoComplete="off"
                                            value={entry.content} onChange={(e) => updateContent(e.target.name, e.target.value)} fullWidth />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={1} sx={{ displayPrint: 'none' }}>
                                    <Stack direction="row" justifyContent="flex-end">
                                        <Button color="primary" variant="outlined" onClick={(e) => removeEntry(index)} disabled={isDisabled || index === 0} sx={{ mt: 2, height: 56 }}>
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