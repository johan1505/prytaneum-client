import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import useSnack from 'hooks/useSnack';
import useEndpoint from 'hooks/useEndpoint';
import LoadingButton from 'components/LoadingButton';
import ReplyIcon from '@material-ui/icons/Comment';

import Dialog from 'components/Dialog';
import TextField from 'components/TextField';
import { replyToReport } from '../api';

interface Props {
    reportId: string;
    reportType: 'feedback' | 'bugs';
}

export default function ReplyForm({ reportId, reportType }: Props) {
    const [showDialog, setShowDialog] = React.useState(false);
    const [replyContent, setReplyContent] = React.useState('');
    const [snack] = useSnack();

    const replyToAPIRequest = React.useCallback(
        () => replyToReport(reportId, replyContent, reportType),
        [replyContent]
    );

    const [sendReplyRequest, isReplyLoading] = useEndpoint(replyToAPIRequest, {
        onSuccess: () => {
            setShowDialog(false);
            snack('Reply successfully submitted', 'success');
            setReplyContent('');
        },
        onFailure: () => {
            snack(
                'Reply could not be submitted. Please try again later',
                'error'
            );
        },
    });

    const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReplyContent(e.target.value);
    };

    const sendReply = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        sendReplyRequest();
    };

    return (
        <Grid item container>
            <Grid item xs={12}>
                <Button
                    id='replyButton'
                    fullWidth
                    variant='contained'
                    color='primary'
                    startIcon={<ReplyIcon />}
                    onClick={() => setShowDialog(true)}
                >
                    Reply
                </Button>
            </Grid>
            <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
                <Grid container align-items='center' justify='center'>
                    <Grid item lg={6} xs={10}>
                        <form
                            onSubmit={sendReply}
                            style={{ marginTop: '30vh' }}
                        >
                            <Grid
                                container
                                align-content='center'
                                justify='center'
                                spacing={4}
                            >
                                <Grid item xs={12}>
                                    <TextField
                                        id='replyContent'
                                        required
                                        multiline
                                        label='Reply Content'
                                        value={replyContent}
                                        onChange={handleContentChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <LoadingButton
                                        loading={isReplyLoading}
                                        component={
                                            <Button
                                                type='submit'
                                                id='submitReplyButton'
                                                variant='contained'
                                                fullWidth
                                                color='primary'
                                            >
                                                Submit
                                            </Button>
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </Dialog>
        </Grid>
    );
}
