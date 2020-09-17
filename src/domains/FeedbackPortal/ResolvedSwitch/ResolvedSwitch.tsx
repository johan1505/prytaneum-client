import React from 'react';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import useSnack from 'hooks/useSnack';
import useEndpoint from 'hooks/useEndpoint';

import { updateReportResolvedStatus } from '../api';
import { FeedbackReport, BugReport } from '../types';

type Report = FeedbackReport | BugReport;
interface Props {
    report: Report;
}

export default function ResolvedSwitch({ report }: Props) {
    const [resolvedStatus, setResolvedStatus] = React.useState(report.resolved);
    const [snack] = useSnack();
    const updateResolvedAPIRequest = React.useCallback(
        () =>
            updateReportResolvedStatus(report._id, resolvedStatus, report.type),
        [report, resolvedStatus]
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [sendUpdateResolvedRequest, isResolvedStatusLoading] = useEndpoint(
        updateResolvedAPIRequest,
        {
            onSuccess: () => {
                snack('Resolved status successfully updated', 'success');
            },
            onFailure: () => {
                // Toggle switch back to original state since update failed
                setResolvedStatus(!resolvedStatus);
                snack(
                    'Resolved status could not be updated. Please try again later',
                    'error'
                );
            },
        }
    );

    return (
        <Grid component='label' container alignItems='center' spacing={2}>
            <Grid item alignItems='center' container spacing={1}>
                <Grid item>Unresolved</Grid>
                <Grid item>
                    <Switch
                        id='resolvedStatusSwitch'
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
        </Grid>
    );
}
