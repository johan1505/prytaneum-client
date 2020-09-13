import React from 'react';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
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
import ResolvedIcon from '@material-ui/icons/Done';
import UnresolvedIcon from '@material-ui/icons/Warning';

import { formatDate } from 'utils/format';
import ReportStateContext from '../Contexts/ReportStateContext';
import Reply from '../Reply';
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
    bold: {
        fontWeight: 'bold',
    },
    marginTop: {
        marginTop: 25,
    },
}));

export default function ReportSummary({ report, callBack }: SummaryProps) {
    const [showReplies, setShowReplies] = React.useState(false);

    const handleShowRepliesClick = () => {
        setShowReplies(!showReplies);
    };

    const { updateReport, refetchReports } = React.useContext(
        ReportStateContext
    );
    const [snack] = useSnack();

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

    const classes = useStyles();

    const onSuccess = (reportState: Report) => {
        updateReport(reportState);
        callBack();
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography variant='h4' align='left'>
                    Date Submitted:
                    {formatDate(new Date(report.date))}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                {report.resolved ? (
                    <Typography
                        variant='subtitle2'
                        align='left'
                        className={classes.bold}
                    >
                        <ResolvedIcon className={classes.green} />
                        Your report has been reviewed and used to improve
                        Prytaneum. Thank you very much!
                    </Typography>
                ) : (
                    <Typography
                        variant='subtitle2'
                        align='left'
                        className={classes.bold}
                    >
                        <UnresolvedIcon className={classes.yellow} />
                        Your report is still pending to be reviewed. We will
                        address it at our earliest convenience. Thank you for
                        your time!
                    </Typography>
                )}
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
            {report.replies.length > 0 && (
                <Grid item container>
                    <Grid item xs={12}>
                        <Button
                            id='showReplies'
                            fullWidth
                            variant='contained'
                            color='primary'
                            startIcon={<ExpandMoreIcon />}
                            onClick={handleShowRepliesClick}
                        >
                            Show Replies
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Collapse in={showReplies} timeout='auto'>
                            {report.replies.map((reply, index) => (
                                <div className={classes.marginTop}>
                                    <Reply key={index} reply={reply} />
                                </div>
                            ))}
                        </Collapse>
                    </Grid>
                </Grid>
            )}
        </Grid>
    );
}
