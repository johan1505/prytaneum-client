import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Grid, Popper, Paper } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';

import useEndpoint from 'hooks/useEndpoint';
import CheckBox from 'components/CheckBox';
import SearchToolbar from 'components/SearchToolbar';
import { UserInfo } from 'domains/AdminDashboard/types';
import { getUserList } from 'domains/AdminDashboard/api/api';

const useStyles = makeStyles((theme) => ({
    root: {},
    filterPopper: {
        maxWidth: '300px',
        marginRight: theme.spacing(1),
    },
}));

export interface Props {
    onLoadUsers: (setHandler: UserInfo[]) => void;
    filterLabel?: string;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    statusTags: string[];
}

type Anchor = (EventTarget & Element) | null;

const AdminToolbar = ({
    onLoadUsers,
    filterLabel,
    setLoading,
    statusTags,
}: Props) => {
    const classes = useStyles();
    const [filterAnchorEl, setFilterAnchorEl] = useState<Anchor>(null);
    const open = Boolean(filterAnchorEl);
    const [enteredFilter, setEnteredFilter] = useState<string>('');
    const [enteredFilterTags, setEnteredFilterTags] = useState<Array<string>>(
        []
    );
    const [sendRequest, isLoading] = useEndpoint(getUserList, {
        onSuccess: (results) => {
            let loadedUsers = results.data.list;
            const copy = [...loadedUsers];

            if (enteredFilter.length > 0) {
                loadedUsers = copy.filter((user) =>
                    user.name
                        .toLowerCase()
                        .includes(enteredFilter.toLowerCase())
                );
            }

            if (enteredFilterTags.length > 0) {
                loadedUsers = loadedUsers.filter((user) =>
                    enteredFilterTags.includes(user.status)
                );
            }

            onLoadUsers(loadedUsers);
        },
    });

    useEffect(() => {
        sendRequest();
        setLoading(isLoading);
    }, [enteredFilter, enteredFilterTags, onLoadUsers, setLoading]);

    const filterClickHandler = (event: React.MouseEvent) => {
        const { currentTarget } = event;
        if (open) setFilterAnchorEl(null);
        else setFilterAnchorEl(currentTarget);
    };

    return (
        <div>
            <Grid container alignItems='center'>
                <Grid item xs={11}>
                    <SearchToolbar
                        label='Search User'
                        onChange={(event) =>
                            setEnteredFilter(event.target.value)
                        }
                    />
                </Grid>
                <Grid item xs={1}>
                    <IconButton
                        aria-label={filterLabel}
                        onClick={filterClickHandler}
                    >
                        <FilterListIcon />
                    </IconButton>
                    <Popper
                        id={filterLabel}
                        open={open}
                        anchorEl={filterAnchorEl}
                    >
                        <Paper className={classes.filterPopper}>
                            <CheckBox
                                options={statusTags}
                                selectedFilter={enteredFilterTags}
                                onChange={(
                                    event: React.ChangeEvent<{}>,
                                    value: React.SetStateAction<Array<string>>,
                                    reason: any
                                ) => setEnteredFilterTags(value)}
                            />
                        </Paper>
                    </Popper>
                </Grid>
            </Grid>
        </div>
    );
};

AdminToolbar.defaultProps = {
    filterLabel: 'filter',
    statusTags: ['admin', 'moderator', 'organizer', 'regular', 'banned'],
};

AdminToolbar.propTypes = {
    onLoadUsers: PropTypes.func.isRequired,
    filterLabel: PropTypes.string,
    setLoading: PropTypes.func.isRequired,
    statusTags: PropTypes.arrayOf(PropTypes.string),
};

export default AdminToolbar;
