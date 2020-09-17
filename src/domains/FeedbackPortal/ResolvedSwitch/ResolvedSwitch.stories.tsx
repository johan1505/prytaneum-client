import React from 'react';
import Container from '@material-ui/core/Container';

import Component from '.';
import { makeFeedbackReport } from '../reportMaker.mock';

export default { title: 'Domains/ResolvedSwitch' };

export function ResolvedSwitch() {
    return (
        <Container maxWidth='sm'>
            <div style={{ marginTop: '30vh' }}>
                <Component report={makeFeedbackReport()} />
            </div>
        </Container>
    );
}
