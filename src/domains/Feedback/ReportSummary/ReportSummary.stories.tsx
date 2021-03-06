import React from 'react';
import { Meta } from '@storybook/react';
import Container from '@material-ui/core/Container';
import { makeFeedbackReport, makeUser } from 'prytaneum-typings';

import UserProvider from 'contexts/User';
import Component from '.';

export default {
    title: 'Domains/Feedback/Report Summary',
    component: Component,
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (MyStory) => (
            <Container maxWidth='sm'>
                <MyStory />
            </Container>
        ),
    ],
} as Meta;

export function ReportSummary() {
    return (
        <UserProvider value={makeUser()} forceNoLogin>
            <Component report={{ ...makeFeedbackReport(), type: 'Feedback' }} callBack={() => {}} />
        </UserProvider>
    );
}
