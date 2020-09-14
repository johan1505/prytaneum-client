import React from 'react';
import Container from '@material-ui/core/Container';

import Component from '.';
import { makeReply } from '../reportMaker.mock';

export default { title: 'Domains/Reply' };

export function Reply() {
    return (
        <Container maxWidth='sm'>
            <Component reply={makeReply()} />
        </Container>
    );
}
