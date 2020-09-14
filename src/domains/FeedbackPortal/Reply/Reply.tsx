import React from 'react';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { formatDate } from 'utils/format';
import { Reply as ReplyType } from '../types';

interface Props {
    reply: ReplyType;
}

export default function Reply({ reply }: Props) {
    return (
        <Card style={{ padding: 20 }}>
            <Grid container spacing={5}>
                <Grid
                    item
                    container
                    justify='space-between'
                    alignItems='center'
                    spacing={3}
                >
                    <Grid item>
                        <Typography variant='h5'>
                            {reply.repliedBy._id}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant='h6'>
                            {formatDate(new Date(reply.repliedDate))}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item>
                    <Typography variant='body1' paragraph>
                        {reply.content}
                    </Typography>
                </Grid>
            </Grid>
        </Card>
    );
}