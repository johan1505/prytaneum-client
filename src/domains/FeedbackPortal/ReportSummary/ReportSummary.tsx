import React from 'react';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import { Delete as DeleteIcon } from '@material-ui/icons';
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

import { formatDate } from 'utils/format';
import Bold from 'components/Bold';
import ReportStateContext from '../Contexts/ReportStateContext';
import Reply from '../Reply';
import ReplyForm from '../ReplyForm';
import ResolvedSwitch from '../ResolvedSwitch';
import FormBase from '../FormBase';
import { FeedbackReport, BugReport } from '../types';

import { deleteBugReport, deleteFeedbackReport } from '../api';

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
        feedback: deleteFunction;
        bugs: deleteFunction;
    } = {
        feedback: (_id: string) => deleteFeedbackReport(_id),
        bugs: (_id: string) => deleteBugReport(_id),
    };

    const deleteApiRequest = React.useCallback(
        () => endpoints[report.type](report._id),
        [endpoints, report]
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

    function ResolvedSection() {
        return user.isAdmin ? (
            <ResolvedSwitch report={report} />
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
                <ReplyForm reportId={report._id} reportType={report.type} />
            )}
            {report.replies.length > 0 && (
                <Grid item container>
                    <Grid item xs={12}>
                        <Button
                            id='showRepliesButton'
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
