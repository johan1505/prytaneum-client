export interface ReportForm {
    _id?: string;
    description?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FeedbackForm extends ReportForm {
    // Add more fields in the future
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BugReportForm extends ReportForm {
    // Add more fields in the future
}

interface User {
    _id: string;
}
export interface Reply {
    content: string;
    repliedBy: User;
    repliedDate: string;
}

type Report = Required<ReportForm> & {
    date: string;
    submitterId: string;
    type: 'feedback' | 'bugs';
    resolved: boolean;
    replies: Reply[];
};

export type FeedbackReport = Report;
export type BugReport = Report & { townhallId: string };
