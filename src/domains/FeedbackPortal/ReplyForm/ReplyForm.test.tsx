/* eslint-disable @typescript-eslint/require-await */
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import faker from 'faker';
import { AxiosResponse } from 'axios';

import ReplyForm from './ReplyForm';
import * as API from '../api/api'; // babel issues ref: https://stackoverflow.com/questions/53162001/typeerror-during-jests-spyon-cannot-set-property-getrequest-of-object-which

jest.mock('hooks/useSnack');

describe('Reply Form', () => {
    let container: HTMLDivElement | null = null;
    const reportId = faker.random.alphaNumeric(12);
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
    it('should render reply form ', async () => {
        ReactTestUtils.act(() => {
            render(
                <ReplyForm reportId={reportId} apiEndpoint='feedback' />,
                container
            );
        });
    });
    it('Should open reply dialog', async () => {
        ReactTestUtils.act(() => {
            render(
                <ReplyForm reportId={reportId} apiEndpoint='feedback' />,
                container
            );
        });
        const replyButton = document.querySelector(
            '#replyButton'
        ) as HTMLButtonElement;

        ReactTestUtils.act(() => {
            replyButton.dispatchEvent(
                new MouseEvent('click', { bubbles: true })
            );
        });

        const replyTextField = document.querySelector(
            '#replyContent'
        ) as HTMLInputElement;

        expect(replyTextField.value).toBe('');
    });

    it('Should open reply dialog and change reply content', async () => {
        const replyContent = faker.lorem.paragraph();
        ReactTestUtils.act(() => {
            render(
                <ReplyForm reportId={reportId} apiEndpoint='feedback' />,
                container
            );
        });
        const replyButton = document.querySelector(
            '#replyButton'
        ) as HTMLButtonElement;

        ReactTestUtils.act(() => {
            replyButton.dispatchEvent(
                new MouseEvent('click', { bubbles: true })
            );
        });

        const replyTextField = document.querySelector(
            '#replyContent'
        ) as HTMLInputElement;

        ReactTestUtils.act(() => {
            ReactTestUtils.Simulate.change(replyTextField, {
                target: ({
                    value: replyContent,
                } as unknown) as EventTarget,
            });
        });
        expect(replyTextField.value).toBe(replyContent);
    });
    it('Should submit a reply to a feedback report summary and succeed', async () => {
        const replyContent = faker.lorem.paragraph();
        const resolvedVal: AxiosResponse = {
            status: 200,
            data: {},
            statusText: 'OK',
            headers: {},
            config: {},
        };
        const spy = jest
            .spyOn(API, 'replyToReport')
            .mockResolvedValue(resolvedVal);
        jest.useFakeTimers();

        ReactTestUtils.act(() => {
            render(
                <ReplyForm reportId={reportId} apiEndpoint='feedback' />,
                container
            );
        });
        const replyButton = document.querySelector(
            '#replyButton'
        ) as HTMLButtonElement;

        ReactTestUtils.act(() => {
            replyButton.dispatchEvent(
                new MouseEvent('click', { bubbles: true })
            );
        });

        const replyTextField = document.querySelector(
            '#replyContent'
        ) as HTMLInputElement;

        const submitReplyButton = document.querySelector(
            '#submitReplyButton'
        ) as HTMLButtonElement;

        ReactTestUtils.act(() => {
            ReactTestUtils.Simulate.change(replyTextField, {
                target: ({
                    value: replyContent,
                } as unknown) as EventTarget,
            });
            submitReplyButton.dispatchEvent(
                new MouseEvent('click', { bubbles: true })
            );
        });

        expect(spy).toBeCalledWith(reportId, replyContent, 'feedback');
        jest.runAllTimers();
        await ReactTestUtils.act(async () => {
            await Promise.allSettled(spy.mock.results);
        });
    });
    // TODO: When runAllTimers is not used the test to submit a reply works fine, why??
    it('Should submit a reply to a bug report summary and succeed', async () => {
        const replyContent = faker.lorem.paragraph();
        const resolvedVal: AxiosResponse = {
            status: 200,
            data: {},
            statusText: 'OK',
            headers: {},
            config: {},
        };
        const spy = jest
            .spyOn(API, 'replyToReport')
            .mockResolvedValue(resolvedVal);
        jest.useFakeTimers();

        ReactTestUtils.act(() => {
            render(
                <ReplyForm reportId={reportId} apiEndpoint='bugs' />,
                container
            );
        });
        const replyButton = document.querySelector(
            '#replyButton'
        ) as HTMLButtonElement;

        ReactTestUtils.act(() => {
            replyButton.dispatchEvent(
                new MouseEvent('click', { bubbles: true })
            );
        });

        const replyTextField = document.querySelector(
            '#replyContent'
        ) as HTMLInputElement;

        const submitReplyButton = document.querySelector(
            '#submitReplyButton'
        ) as HTMLButtonElement;

        ReactTestUtils.act(() => {
            ReactTestUtils.Simulate.change(replyTextField, {
                target: ({
                    value: replyContent,
                } as unknown) as EventTarget,
            });
            submitReplyButton.dispatchEvent(
                new MouseEvent('click', { bubbles: true })
            );
        });

        expect(spy).toBeCalledWith(reportId, replyContent, 'bugs');
        jest.runAllTimers();
        await ReactTestUtils.act(async () => {
            await Promise.allSettled(spy.mock.results);
        });
    });
});
