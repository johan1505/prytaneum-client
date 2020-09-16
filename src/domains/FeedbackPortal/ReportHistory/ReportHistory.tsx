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
import Pagination from '@material-ui/lab/Pagination';

import useEndpoint from 'hooks/useEndpoint';
import useSnack from 'hooks/useSnack';
import Loader from 'components/Loader';
import LoadingButton from 'components/LoadingButton';
import ReportList from 'domains/FeedbackPortal/ReportList';
import ReportStateContext from '../Contexts/ReportStateContext';
import {
    getFeedbackReportsBySubmitter,
    getBugReportsBySubmitter,
} from '../api';
import { FeedbackReport, BugReport } from '../types';

type ReportTypes = 'Feedback' | 'Bug' | '';
type SortingTypes = 'true' | 'false' | '';
type Report = FeedbackReport | BugReport;

const ReportOptions = ['Feedback', 'Bug'];
const sortingOptions = [
    { name: 'Ascending', value: 'true' },
    { name: 'Descending', value: 'false' },
];

// TODO: auth
const user = {
    _id: '123456789',
};
const pageSize = 10;
const useStyles = makeStyles((theme: Theme) => ({
    select: {
        borderColor: theme.palette.common.white,
        color: theme.palette.common.white,
    },
}));

export default function ReportHistory() {
    const classes = useStyles();
    const [prevReportType, setPrevReportType] = React.useState<ReportTypes>('');
    const [reportType, setReportType] = React.useState<ReportTypes>('');
    const [sortingOrder, setSortingOrder] = React.useState<SortingTypes>('');
    const [page, setPage] = React.useState(1);
    const [numOfPages, setNumOfPages] = React.useState(0);
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
            case 'Feedback':
                return (
                    pageNumber: number,
                    sorting: SortingTypes,
                    submitterId: string
                ) =>
                    getFeedbackReportsBySubmitter(
                        pageNumber,
                        sorting,
                        submitterId
                    );
            case 'Bug':
                return (
                    pageNumber: number,
                    sorting: SortingTypes,
                    submitterId: string
                ) => getBugReportsBySubmitter(pageNumber, sorting, submitterId);
            default:
                return (
                    pageNumber: number,
                    sorting: SortingTypes,
                    submitterId: string
                ) =>
                    getFeedbackReportsBySubmitter(
                        pageNumber,
                        sorting,
                        submitterId
                    );
        }
    };

    const getReportsAPIRequest = React.useCallback(
        () => getEndpoints(reportType)(page, sortingOrder, user._id),
        [reportType, page, sortingOrder, user]
    );

    const [sendGetRequest, isLoading] = useEndpoint(getReportsAPIRequest, {
        onSuccess: (results) => {
            // Adds type attribute to report objects. This will be needed in children components

            if (results.data.reports.length === 0) {
                snack('No reports were found', 'warning');
            } else {
                const requestedReports = results.data.reports.map((report) => ({
                    ...report,
                    type: reportType,
                })) as Report[];
                setNumOfPages(results.data.count / pageSize);
                setReports(requestedReports);
            }
        },
    });

    const sendRequest = () => {
        // Clean reports from state of component
        setReports([]);
        // If the report type selected has changed then set the page number to 1
        if (prevReportType !== reportType) {
            setPage(1);
        }
        // save the report type just selected
        setPrevReportType(reportType);
        sendGetRequest();
    };

    const handlePageChange = (
        event: React.ChangeEvent<unknown>,
        value: number
    ) => {
        setPage(value);
        sendRequest();
    };

    const getReports = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        sendRequest();
    };

    const findReport = (reportsToIterate: Report[], report: Report) => {
        return reportsToIterate.findIndex((rp) => rp._id === report._id);
    };

    const updateReport = (report: Report) => {
        const prevReports = [...reports];
        const indexOfReport = findReport(prevReports, report);
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
                                                key={ReportOption}
                                                value={ReportOption}
                                            >
                                                {ReportOption}
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
                                    // loading={isLoadingFeedback || isLoadingBug}
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

            {/*  Loader is rendering at some weird position, is it because of the absolute attribute?  */}
            <Grid container justify='center' alignItems='center'>
                {isLoading ? (
                    <Loader />
                ) : (
                    <ReportStateContext.Provider value={customReportFunctions}>
                        <ReportList reports={reports} />
                    </ReportStateContext.Provider>
                )}
            </Grid>

            {reports.length !== 0 && (
                <Grid container justify='center' alignItems='center'>
                    <Pagination
                        siblingCount={0}
                        color='primary'
                        count={numOfPages}
                        page={page}
                        onChange={handlePageChange}
                    />
                </Grid>
            )}
        </div>
    );
}
