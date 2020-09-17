/* eslint-disable @typescript-eslint/require-await */
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';

import { formatDate } from 'utils/format';
import Reply from './Reply';
import { makeReply } from '../reportMaker.mock';

jest.mock('hooks/useSnack');

describe('Reply Form', () => {
    let container: HTMLDivElement | null = null;
    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        if (container) {
            unmountComponentAtNode(container);
            container.remove();
        }
        container = null;
        jest.restoreAllMocks();
    });

    // eslint-disable-next-line jest/expect-expect
    it('should render reply', async () => {
        ReactTestUtils.act(() => {
            render(<Reply reply={makeReply()} />, container);
        });
    });
    it('Should verify the content of the reply', async () => {
        const reply = makeReply();
        ReactTestUtils.act(() => {
            render(<Reply reply={reply} />, container);
        });
        const replyContent = document.querySelector(
            '#replyContent'
        ) as HTMLParagraphElement;

        expect(replyContent.textContent).toBe(reply.content);
    });

    it('Should verify the date of the reply', async () => {
        const reply = makeReply();
        ReactTestUtils.act(() => {
            render(<Reply reply={reply} />, container);
        });
        const replyDate = document.querySelector(
            '#replyDate'
        ) as HTMLHeadElement;

        expect(replyDate.textContent).toBe(
            formatDate(new Date(reply.repliedDate))
        );
    });
});
