import React from 'react';
import Container from '@material-ui/core/Container';
import faker from 'faker';

import Component from '.';

export default { title: 'Domains/ResolvedSwitch' };

export function ResolvedSwitch() {
    return (
        <Container maxWidth='sm'>
            <div style={{ marginTop: '30vh' }}>
                <Component
                    reportId={faker.random.alphaNumeric(12)}
                    reportResolvedStatus={faker.random.boolean()}
                    reportType='bugs'
                />
            </div>
        </Container>
    );
}
