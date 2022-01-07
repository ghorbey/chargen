import React from 'react';
import { Select, MenuItem } from '@mui/material';

export default function Character(props) {
    const character = props;
    const isEdit = false;
    if (isEdit) {
        return (
            <div>
                <label>
                    <p>Personnage :</p>
                    <input type="text" value="{character.character_name}" />
                </label>
                <label>
                    <Select value="{character.character_type}">
                        <MenuItem value="pj">PJ</MenuItem>
                        <MenuItem value="pnj">PNJ</MenuItem>
                    </Select>
                </label>
                <label>
                    <p>ID :</p>
                    <input type="text" value="{character.user_id}" />
                </label>
            </div>
        );
    } else {
        return (
            <div>
                <div>{character.user_id}</div>
                <div>{character.character_name}</div>
            </div>
        );
    }
};