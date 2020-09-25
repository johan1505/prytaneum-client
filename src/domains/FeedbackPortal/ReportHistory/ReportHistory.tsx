import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {
    Sort as SortIcon,
    Search as SearchIcon,
    ArrowDropDown as ArrowDownIcon,
} from '@material-ui/icons';

import useEndpoint from 'hooks/useEndpoint';
import useSnack from 'hooks/useSnack';
import InfiniteScroll from 'components/InfiniteScroll';
import LoadingButton from 'components/LoadingButton';
import ReportList from 'domains/FeedbackPortal/ReportList';
import ReportStateContext from '../Contexts/ReportStateContext';
import {
    getFeedbackReportsBySubmitter,
    getBugReportsBySubmitter,
} from '../api';
import { FeedbackReport, BugReport } from '../types';

type ReportTypes = 'feedback' | 'bugs' | '';
type SortingTypes = 'true' | 'false' | '';
type Report = FeedbackReport | BugReport;

const ReportOptions = [
    { name: 'Feedback', value: 'feedback' },
    { name: 'Bug', value: 'bugs' },
];
const sortingOptions = [
    { name: 'Ascending', value: 'true' },
    { name: 'Descending', value: 'false' },
];
// TODO: auth
const user = {
    _id: '123456789',
};
const useStyles = makeStyles((theme: Theme) => ({
    select: {
        borderColor: theme.palette.common.white,
        color: theme.palette.common.white,
    },
}));
const maxNumberOfReportsPerResponse = 15;

export default function ReportHistory() {
    const classes = useStyles();
    const [prevReportType, setPrevReportType] = React.useState<ReportTypes>('');
    const [reportType, setReportType] = React.useState<ReportTypes>('');
    const [sortingOrder, setSortingOrder] = React.useState<SortingTypes>('');
    const [page, setPage] = React.useState(1);
    const [hasNext, setHasNext] = React.useState(true);
    const [reports, setReports] = React.useState<Report[]>([]);
    const [snack] = useSnack();

    const handleReportTypeChange = (
        e: React.ChangeEvent<{ value: unknown }>
    ) => {
        setReportType(e.target.value as ReportTypes);
    };

    const handleSortingChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        setSortingOrder(e.target.value as SortingTypes);
    };

    const getEndpoints = (reportTypeParam: ReportTypes) => {
        switch (reportTypeParam) {
            case 'feedback':
                return (
                    pageNumber: number,
                    sorting: SortingTypes,
                    submitterId: string
                ) =>
                    getFeedbackReportsBySubmitter(
                        pageNumber,
                        maxNumberOfReportsPerResponse,
                        sorting,
                        submitterId
                    );
            case 'bugs':
                return (
                    pageNumber: number,
                    sorting: SortingTypes,
                    submitterId: string
                ) =>
                    getBugReportsBySubmitter(
                        pageNumber,
                        maxNumberOfReportsPerResponse,
                        sorting,
                        submitterId
                    );
            default:
                return (
                    pageNumber: number,
                    sorting: SortingTypes,
                    submitterId: string
                ) =>
                    getFeedbackReportsBySubmitter(
                        pageNumber,
                        maxNumberOfReportsPerResponse,
                        sorting,
                        submitterId
                    );
        }
    };

    const getReportsAPIRequest = React.useCallback(
        () => getEndpoints(reportType)(page, sortingOrder, user._id),
        [reportType, page, sortingOrder]
    );

    const [sendGetRequest, isLoading] = useEndpoint(getReportsAPIRequest, {
        onSuccess: (results) => {
            // Adds type attribute to report objects. This will be needed in children components
            if (results.data.reports.length === 0) {
                snack('No reports were found', 'warning');
            } else {
                // Add type attribute to reports
                const requestedReports = results.data.reports.map((report) => ({
                    ...report,
                    type: reportType,
                })) as Report[];
                // If type of report is still the same then append fetched reports to the state of reports
                if (prevReportType === reportType) {
                    setReports((prevReports) => [
                        ...prevReports,
                        ...requestedReports,
                    ]);
                } else {
                    setReports(requestedReports);
                }
                // Increment page regardless
                setPage(page + 1);
            }
            setHasNext(results.data.hasNext);
            // save the report type just selected
            setPrevReportType(reportType);
        },
    });

    const sendRequest = () => {
        // If reports type has changed then set page number to 1
        if (prevReportType !== reportType) setPage(1);
        sendGetRequest();
    };

    const getReports = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        // If the type of report has not been changed then just return. User Needs to scroll down to get more reports
        if (prevReportType === reportType) {
            console.log('xd');
            return;
        }

        sendRequest();
    };

    const findReportIndex = (reportsToIterate: Report[], report: Report) => {
        return reportsToIterate.findIndex((rp) => rp._id === report._id);
    };

    const updateReport = (report: Report) => {
        const prevReports = [...reports];
        const indexOfReport = findReportIndex(prevReports, report);
        if (indexOfReport === -1) {
            return;
        }
        prevReports[indexOfReport] = report;
        setReports(prevReports);
    };

    const customReportFunctions = {
        updateReport,
        refetchReports: () => sendRequest(),
    };

    return (
        <div>
            <AppBar position='sticky'>
                <Toolbar>
                    <form onSubmit={getReports}>
                        <Grid container alignItems='center' spacing={3}>
                            <Grid item>
                                <FormControl>
                                    <Select
                                        className={classes.select}
                                        id='reportSelector'
                                        disabled={isLoading}
                                        displayEmpty
                                        required
                                        value={reportType}
                                        onChange={handleReportTypeChange}
                                        input={<Input />}
                                        IconComponent={() => <ArrowDownIcon />}
                                    >
                                        <MenuItem disabled value=''>
                                            Report Type
                                        </MenuItem>

                                        {ReportOptions.map((ReportOption) => (
                                            <MenuItem
                                                key={ReportOption.name}
                                                value={ReportOption.value}
                                            >
                                                {ReportOption.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <FormControl>
                                    <Select
                                        id='sortingSelector'
                                        className={classes.select}
                                        disabled={isLoading}
                                        displayEmpty
                                        required
                                        value={sortingOrder}
                                        onChange={handleSortingChange}
                                        input={<Input />}
                                        IconComponent={() => <SortIcon />}
                                    >
                                        <MenuItem disabled value=''>
                                            Sorting Order
                                        </MenuItem>
                                        {sortingOptions.map((sortingOption) => (
                                            <MenuItem
                                                key={sortingOption.name}
                                                value={sortingOption.value}
                                            >
                                                {sortingOption.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <LoadingButton
                                    loading={isLoading}
                                    component={
                                        <Button
                                            type='submit'
                                            color='inherit'
                                            endIcon={<SearchIcon />}
                                        >
                                            Search
                                        </Button>
                                    }
                                />
                            </Grid>
                        </Grid>
                    </form>
                </Toolbar>
            </AppBar>
            {/* TODO: Infinite scroll does not work, this might be because it uses a main element  */}
            <InfiniteScroll
                loadMore={hasNext ? sendRequest : null}
                isLoading={isLoading}
            >
                <Grid container justify='center' alignItems='center'>
                    <ReportStateContext.Provider value={customReportFunctions}>
                        <ReportList reports={reports} />
                    </ReportStateContext.Provider>
                </Grid>
            </InfiniteScroll>
        </div>
    );
}
