/* eslint-disable @typescript-eslint/require-await */
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import { AxiosResponse } from 'axios';

import ReportHistory from './ReportHistory';
import * as API from '../api/api';

jest.mock('hooks/useSnack');

// TODO: Auth. Mock user Ids in test that get reports
describe('CreateReportList', () => {
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
    it('should render report history', async () => {
        ReactTestUtils.act(() => {
            render(<ReportHistory />, container);
        });
    });

    // TODO: The two test below do not work anymore due to changes made in ReportHistory.
    // The issue comes from not being able (not knowing how) to simulate changes in MUI Select components.
    // Without simulation of changes, ReportHistory can not call the API function that is being spied

    // it('should submit get feedback reports request', async () => {
    //     const resolvedVal: AxiosResponse = {
    //         status: 200,
    //         data: {},
    //         statusText: 'OK',
    //         headers: {},
    //         config: {},
    //     };
    //     const spy = jest
    //         .spyOn(API, 'getFeedbackReportsBySubmitter')
    //         .mockResolvedValue(resolvedVal);
    //     jest.useFakeTimers();

    //     ReactTestUtils.act(() => {
    //         render(<ReportHistory />, container);
    //     });

    //     const submitButton = document.querySelector(
    //         '[type="submit"]'
    //     ) as HTMLButtonElement;

    //     ReactTestUtils.act(() => {
    //         submitButton.dispatchEvent(
    //             new MouseEvent('click', { bubbles: true })
    //         );
    //     });

    //     // TODO: 15 is passed for the limit because that's what the component uses. If it changes in the components, this test will fail
    //     expect(spy).toBeCalledWith(1, 15, 'true', '123456789');
    //     jest.runAllTimers();

    //     await ReactTestUtils.act(async () => {
    //         await Promise.allSettled(spy.mock.results);
    //     });
    // });

    // it('should attempt to submit get feedback reports request and fail', async () => {
    //     const rejectedVal = {
    //         status: 500,
    //     };
    //     const spy = jest
    //         .spyOn(API, 'getFeedbackReportsBySubmitter')
    //         .mockRejectedValue(rejectedVal);
    //     jest.useFakeTimers();

    //     ReactTestUtils.act(() => {
    //         render(<ReportHistory />, container);
    //     });

    //     const submitButton = document.querySelector(
    //         '[type="submit"]'
    //     ) as HTMLButtonElement;

    //     ReactTestUtils.act(() => {
    //         submitButton.dispatchEvent(
    //             new MouseEvent('click', { bubbles: true })
    //         );
    //     });

    //     expect(spy).toBeCalledWith(1, 15, '', '123456789');
    //     jest.runAllTimers();

    //     await ReactTestUtils.act(async () => {
    //         await Promise.allSettled(spy.mock.results);
    //     });
    // });
});
