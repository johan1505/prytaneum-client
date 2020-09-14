import React from 'react';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import { Delete as DeleteIcon } from '@material-ui/icons';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { red, green, yellow } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import { AxiosResponse } from 'axios';
import useSnack from 'hooks/useSnack';
import useEndpoint from 'hooks/useEndpoint';
import LoadingButton from 'components/LoadingButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ResolvedIcon from '@material-ui/icons/Done';
import UnresolvedIcon from '@material-ui/icons/Warning';
import ReplyIcon from '@material-ui/icons/Comment';

import { formatDate } from 'utils/format';
import Bold from 'components/Bold';
import Loader from 'components/Loader';
import Dialog from 'components/Dialog';
import TextField from 'components/TextField';
import ReportStateContext from '../Contexts/ReportStateContext';
import Reply from '../Reply';
import FormBase from '../FormBase';
import { FeedbackReport, BugReport } from '../types';

import {
    deleteBugReport,
    deleteFeedbackReport,
    replyToReport,
    updateReportResolvedStatus,
} from '../api';

type Report = FeedbackReport | BugReport;
interface SummaryProps {
    report: Report;
    callBack: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
    DangerButton: {
        color: theme.palette.getContrastText(red[700]),
        backgroundColor: red[700],
        '&:hover': {
            backgroundColor: red[900],
        },
    },
    yellow: {
        color: yellow[600],
    },
    green: {
        color: green[600],
    },
    marginTop: {
        marginTop: 25,
    },
}));

// TODO: Auth
const user = {
    isAdmin: true,
};

export default function ReportSummary({ report, callBack }: SummaryProps) {
    const [showReplies, setShowReplies] = React.useState(false);
    const [showDialog, setShowDialog] = React.useState(false);
    const [replyContent, setReplyContent] = React.useState('');
    const [resolvedStatus, setResolvedStatus] = React.useState(report.resolved);
    const [snack] = useSnack();
    const classes = useStyles();

    const handleShowRepliesClick = () => {
        setShowReplies(!showReplies);
    };

    const { updateReport, refetchReports } = React.useContext(
        ReportStateContext
    );

    type deleteFunction = (_id: string) => Promise<AxiosResponse<unknown>>;
    const endpoints: {
        Feedback: deleteFunction;
        Bug: deleteFunction;
    } = {
        Feedback: (_id: string) => deleteFeedbackReport(_id),
        Bug: (_id: string) => deleteBugReport(_id),
    };

    const deleteApiRequest = React.useCallback(
        () => endpoints[report.type](report._id),
        [report]
    );

    const [sendDeleteRequest, isLoading] = useEndpoint(deleteApiRequest, {
        onSuccess: () => {
            callBack();
            refetchReports();
            snack('Report successfully deleted', 'success');
        },
        onFailure: () => {
            snack('Something went wrong! Try again', 'error');
        },
    });

    const onSuccess = (reportState: Report) => {
        updateReport(reportState);
        callBack();
    };

    const APIDict: { Feedback: 'feedback'; Bug: 'bugs' } = {
        Feedback: 'feedback',
        Bug: 'bugs',
    };

    const replyToAPIRequest = React.useCallback(
        () =>
            replyToReport(
                report._id,
                replyContent,
                new Date().toISOString(),
                APIDict[report.type]
            ),
        [report, replyContent]
    );

    const [sendReplyRequest, isReplyLoading] = useEndpoint(replyToAPIRequest, {
        onSuccess: () => {
            setShowDialog(false);
            snack('Reply successfully submitted', 'success');
            setReplyContent('');
        },
    });

    const sendReply = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        sendReplyRequest();
    };

    const updateResolvedAPIRequest = React.useCallback(
        () =>
            updateReportResolvedStatus(
                report._id,
                resolvedStatus,
                APIDict[report.type]
            ),
        [report, resolvedStatus]
    );

    const [sendUpdateResolvedRequest, isResolvedStatusLoading] = useEndpoint(
        updateResolvedAPIRequest,
        {
            onSuccess: () => {
                snack('Resolved status successfully updated', 'success');
            },
        }
    );
    function ResolvedSection() {
        return user.isAdmin ? (
            <Grid component='label' container alignItems='center' spacing={2}>
                {isResolvedStatusLoading ? (
                    <Loader />
                ) : (
                    <Grid item alignItems='center' container spacing={1}>
                        <Grid item>Unresolved</Grid>
                        <Grid item>
                            <Switch
                                checked={resolvedStatus}
                                onChange={() => {
                                    setResolvedStatus(!resolvedStatus);
                                    sendUpdateResolvedRequest();
                                }}
                                name='resolved'
                            />
                        </Grid>
                        <Grid item>Resolved</Grid>
                    </Grid>
                )}
            </Grid>
        ) : (
            <Bold>
                {report.resolved ? (
                    <>
                        <ResolvedIcon className={classes.green} />
                        Your report has been reviewed and used to improve
                        Prytaneum. Thank you very much!
                    </>
                ) : (
                    <>
                        <UnresolvedIcon className={classes.yellow} />
                        Your report is still pending to be reviewed. We will
                        address it at our earliest convenience. Thank you for
                        your patience.
                    </>
                )}
            </Bold>
        );
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Bold>
                    <h1>
                        {`Date Submitted: ${formatDate(new Date(report.date))}`}
                    </h1>
                </Bold>
            </Grid>
            <Grid item xs={12}>
                <ResolvedSection />
            </Grid>
            <Grid item xs={12}>
                <Typography variant='body1' paragraph>
                    You can change the description of your report. Once you are
                    done, just press the “Submit” button.
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <FormBase
                    report={report}
                    reportType={report.type}
                    onSuccess={onSuccess}
                    submitType='update'
                />
            </Grid>
            <Grid item xs={12}>
                <LoadingButton
                    loading={isLoading}
                    component={
                        <Button
                            id='deleteButton'
                            variant='contained'
                            fullWidth
                            className={classes.DangerButton}
                            startIcon={<DeleteIcon />}
                            onClick={() => sendDeleteRequest()}
                        >
                            Delete
                        </Button>
                    }
                />
            </Grid>
            {user.isAdmin && (
                <Grid item container>
                    <Grid item xs={12}>
                        <Button
                            id='showReplies'
                            fullWidth
                            variant='contained'
                            color='primary'
                            startIcon={<ReplyIcon />}
                            onClick={() => setShowDialog(true)}
                        >
                            Reply
                        </Button>
                    </Grid>
                    <Dialog
                        open={showDialog}
                        onClose={() => setShowDialog(false)}
                    >
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
                                                onChange={(e) =>
                                                    setReplyContent(
                                                        e.target.value
                                                    )
                                                }
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
            )}
            {report.replies.length > 0 && (
                <Grid item container>
                    <Grid item xs={12}>
                        <Button
                            id='showReplies'
                            fullWidth
                            variant='contained'
                            color='primary'
                            startIcon={
                                showReplies ? (
                                    <ExpandLessIcon />
                                ) : (
                                    <ExpandMoreIcon />
                                )
                            }
                            onClick={handleShowRepliesClick}
                        >
                            {showReplies ? 'Hide Replies' : 'Show Replies'}
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Collapse in={showReplies} timeout='auto'>
                            {report.replies.map((reply, index) => (
                                <div className={classes.marginTop} key={index}>
                                    <Reply reply={reply} />
                                </div>
                            ))}
                        </Collapse>
                    </Grid>
                </Grid>
            )}
        </Grid>
    );
}
