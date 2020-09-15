import React from 'react';
import Container from '@material-ui/core/Container';
import faker from 'faker';

import Component from '.';

export default { title: 'Domains/ResolvedSwitch' };

export function ResolvedSwitch() {
    return (
        <Container maxWidth='sm'>
            <Component
                reportId={faker.random.alphaNumeric(12)}
                reportResolvedStatus={faker.random.boolean()}
                apiEndpoint='bugs'
            />
        </Container>
    );
}
