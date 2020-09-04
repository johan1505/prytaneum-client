import React, { useState, useEffect, ChangeEvent } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
    })
);

interface MemberLabel {
    first_name: string;
    last_name: string;
}

export default function MoCDropdown() {
    const classes = useStyles();

    const [chamber, setChamber] = useState('');
    const [input, setInput] = useState('');
    const [data2, setData2] = useState([]);
    const [form, setForm] = React.useState({
        username: '',
    });

    const handleChange = (event: ChangeEvent<{ value: unknown }>) => {
        setChamber(event.target.value as string);
    };

    const nameChange = (event: ChangeEvent<{ value: unknown }>) => {
        setInput(event.target.value as string);
    };

    const handleChange2 = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
        id: string
    ) => {
        e.preventDefault();
        const { value } = e.target;
        setForm((state) => ({ ...state, [id]: value }));
    };

    useEffect(() => {
        const url = `https://api.propublica.org/congress/v1/116/${chamber}/members.json`;
        axios
            .get(url, {
                headers: {
                    'X-API-Key': process.env.REACT_APP_PROPUBLICA_API_KEY,
                },
            })
            .then((response) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                setData2(response.data.results[0].members);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [chamber]);

    return (
        <div>
            <FormControl className={classes.formControl}>
                <InputLabel id='demo-simple-select-helper-label'>
                    Chamber
                </InputLabel>
                <Select
                    labelId='demo-simple-select-helper-label'
                    className='help'
                    value={chamber}
                    inputProps={{
                        id: 'selectField',
                    }}
                    onChange={handleChange}
                >
                    <MenuItem value='House'>House</MenuItem>
                    <MenuItem value='Senate'>Senate</MenuItem>
                </Select>
                <FormHelperText>Select a chamber</FormHelperText>
            </FormControl>

            <Autocomplete
                id='optionBox'
                options={data2 as MemberLabel[]}
                getOptionLabel={(option) =>
                    `${option.first_name} ${option.last_name}`
                }
                style={{ width: 300 }}
                renderInput={(params) => (
                    <TextField
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...params}
                        className='helloThere'
                        variant='outlined'
                        label='type here'
                        id='standard-premium'
                        value={input}
                        onChange={nameChange}
                        inputProps={{
                            ...params.inputProps,
                            id: 'standard-premium',
                        }}
                    />
                )}
            />

            <TextField
                id='standard-basic'
                onChange={(e) => handleChange2(e, 'username')}
                value={form.username}
                label='Standard'
            />
        </div>
    );
}
