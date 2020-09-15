import { rest } from 'msw';

import {
    makeFeedbackReport,
    makeBugReport,
} from 'domains/FeedbackPortal/reportMaker.mock';

const makeFeedbackReports = (n: number) => {
    const reports = [];
    for (let i = 0; i < n; i += 1) {
        reports.push(makeFeedbackReport());
    }
    return reports;
};

const makeBugReports = (n: number) => {
    const reports = [];
    for (let i = 0; i < n; i += 1) {
        reports.push(makeBugReport());
    }
    return reports;
};

export default [
    // Feedback reports
    rest.post('/api/feedback/create-report', (req, res, ctx) => {
        const { description } = req.body as {
            description: string;
        };
        if (description === 'fail') {
            return res(ctx.status(400));
        }
        return res(ctx.status(200));
    }),

    rest.get('/api/feedback/get-reports/:submitterId', (req, res, ctx) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { submitterId } = req.params;
        const page = req.url.searchParams.get('page');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const sortByDate = req.url.searchParams.get('sortByDate');

        if (!page) {
            return res(ctx.status(400));
        }
        return res(
            ctx.status(200),
            ctx.json({
                reports: makeFeedbackReports(10),
                count: 70,
            })
        );
    }),

    rest.post('/api/feedback/update-report', (req, res, ctx) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { newDescription, _id } = req.body as {
            newDescription: string;
            _id: string;
        };

        if (newDescription === 'fail') {
            return res(ctx.status(400));
        }
        return res(ctx.status(200));
    }),

    rest.post('/api/feedback/delete-report', (req, res, ctx) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id } = req.body as {
            _id: string;
        };
        return res(ctx.status(200));
    }),

    rest.post('/api/feedback/update-resolved-status/:id', (req, res, ctx) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id } = req.params as {
            _id: string;
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { resolvedStatus } = req.body as { resolvedStatus: boolean };
        return res(ctx.status(200));
    }),

    rest.post('/api/feedback/reply-to/:id', (req, res, ctx) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id } = req.params as {
            _id: string;
        };
        const { replyContent } = req.body as {
            replyContent: string;
        };

        if (replyContent === 'fail') {
            return res(ctx.status(400));
        }
        return res(ctx.status(200));
    }),

    // Bug reports
    rest.post('/api/bugs/create-report', (req, res, ctx) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { description, townhallId } = req.body as {
            description: string;
            townhallId: string;
        };
        if (description === 'fail') {
            return res(ctx.status(400));
        }
        return res(ctx.status(200));
    }),

    rest.get('/api/bugs/get-reports/:submitterId', (req, res, ctx) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { submitterId } = req.params;
        const page = req.url.searchParams.get('page');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const sortByDate = req.url.searchParams.get('sortByDate');

        if (!page) {
            return res(ctx.status(400));
        }
        return res(
            ctx.status(200),
            ctx.json({
                reports: makeBugReports(10),
                count: 90,
            })
        );
    }),

    rest.post('/api/bugs/update-report', (req, res, ctx) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { newDescription, _id } = req.body as {
            newDescription: string;
            _id: string;
        };
        if (newDescription === 'fail') {
            return res(ctx.status(400));
        }
        return res(ctx.status(200));
    }),

    rest.post('/api/bugs/delete-report', (req, res, ctx) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id } = req.body as {
            _id: string;
        };
        return res(ctx.status(200));
    }),
    rest.post('/api/bugs/update-resolved-status/:id', (req, res, ctx) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id } = req.params as {
            _id: string;
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { resolvedStatus } = req.body as { resolvedStatus: boolean };
        return res(ctx.status(200));
    }),

    rest.post('/api/bugs/reply-to/:id', (req, res, ctx) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id } = req.params as {
            _id: string;
        };
        const { replyContent } = req.body as {
            replyContent: string;
        };

        if (replyContent === 'fail') {
            return res(ctx.status(400));
        }
        return res(ctx.status(200));
    }),
];
