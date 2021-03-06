import React from 'react';
import { Meta } from '@storybook/react';
import { makeFeedbackReport } from 'prytaneum-typings';

import Component from '.';

export default { title: 'Domains/Feedback/Form Base', parameters: { layout: 'centered' } } as Meta;

export function Basic() {
    return (
        <Component report={{ ...makeFeedbackReport(), type: 'Feedback' }} submitType='create' reportType='Feedback' />
    );
}
