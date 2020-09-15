import React from 'react';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import useSnack from 'hooks/useSnack';
import useEndpoint from 'hooks/useEndpoint';

import Loader from 'components/Loader';
import { updateReportResolvedStatus } from '../api';

interface SummaryProps {
    reportId: string;
    reportResolvedStatus: boolean;
    apiEndpoint: 'feedback' | 'bugs';
}

export default function ReportSummary({
    reportId,
    reportResolvedStatus,
    apiEndpoint,
}: SummaryProps) {
    const [resolvedStatus, setResolvedStatus] = React.useState(
        reportResolvedStatus
    );
    const [snack] = useSnack();

    const updateResolvedAPIRequest = React.useCallback(
        () => updateReportResolvedStatus(reportId, resolvedStatus, apiEndpoint),
        [resolvedStatus]
    );

    const [sendUpdateResolvedRequest, isResolvedStatusLoading] = useEndpoint(
        updateResolvedAPIRequest,
        {
            onSuccess: () => {
                snack('Resolved status successfully updated', 'success');
            },
            onFailure: () => {
                snack(
                    'Resolved status could not be updated. Please try again later',
                    'error'
                );
            },
        }
    );

    return (
        <Grid component='label' container alignItems='center' spacing={2}>
            {isResolvedStatusLoading ? (
                <Loader />
            ) : (
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
            )}
        </Grid>
    );
}
