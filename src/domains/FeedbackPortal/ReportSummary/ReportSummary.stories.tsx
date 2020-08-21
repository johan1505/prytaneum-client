import React from 'react';
import Container from '@material-ui/core/Container';
import faker from 'faker';

import Component from '.';

// TODO: For some reason, the select control does not change what component gets rendered.
export default {
    title: 'Domains/ReportSummary',
    component: Component,
    argTypes: {
        ReportType: {
            control: {
                type: 'select',
                options: ['Feedback', 'Bug'],
            },
        },
    },
};

const FeedbackReport = {
    description: faker.lorem.paragraph(),
    date: new Date().toISOString(),
    _id: faker.random.alphaNumeric(12),
    user: {
        _id: faker.random.alphaNumeric(12),
    },
};

const BugReport = {
    description: faker.lorem.paragraph(),
    date: new Date().toISOString(),
    _id: faker.random.alphaNumeric(12),
    townhallId: faker.random.alphaNumeric(12),
    user: {
        _id: faker.random.alphaNumeric(12),
    },
};

interface Props {
    ReportType: string;
}
export function ReportSummary({ ReportType }: Props) {
    return (
        <Container maxWidth='sm'>
            {ReportType === 'Feedback' ? (
                <Component Report={FeedbackReport} Type='feedback' />
            ) : (
                <Component Report={BugReport} Type='bug' />
            )}
        </Container>
    );
}