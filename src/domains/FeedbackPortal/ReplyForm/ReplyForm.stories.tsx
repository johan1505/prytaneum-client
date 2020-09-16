import React from 'react';
import Container from '@material-ui/core/Container';
import faker from 'faker';

import Component from '.';

export default { title: 'Domains/ReplyForm' };

export function ReplyForm() {
    return (
        <Container maxWidth='sm'>
            <Component
                reportId={faker.random.alphaNumeric(12)}
                reportType='feedback'
            />
        </Container>
    );
}
