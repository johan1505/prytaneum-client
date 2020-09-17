/* eslint-disable @typescript-eslint/require-await */
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import { AxiosResponse } from 'axios';

import ResolvedSwitch from './ResolvedSwitch';
import { makeFeedbackReport, makeBugReport } from '../reportMaker.mock';
import * as API from '../api/api'; // babel issues ref: https://stackoverflow.com/questions/53162001/typeerror-during-jests-spyon-cannot-set-property-getrequest-of-object-which

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
    it('should render resolved switch ', async () => {
        ReactTestUtils.act(() => {
            render(<ResolvedSwitch report={makeFeedbackReport()} />, container);
        });
    });
    it('Should render a switch with the appropriate checked attribute', async () => {
        const report = makeFeedbackReport();
        ReactTestUtils.act(() => {
            render(<ResolvedSwitch report={report} />, container);
        });
        const resolvedSwitch = document.querySelector(
            '#resolvedStatusSwitch'
        ) as HTMLInputElement;
        expect(resolvedSwitch.checked).toBe(report.resolved);
    });
    it('Should update the resolved status of a feedback report', async () => {
        const report = makeFeedbackReport();
        const resolvedVal: AxiosResponse = {
            status: 200,
            data: {},
            statusText: 'OK',
            headers: {},
            config: {},
        };
        const spy = jest
            .spyOn(API, 'updateReportResolvedStatus')
            .mockResolvedValue(resolvedVal);
        jest.useFakeTimers();

        ReactTestUtils.act(() => {
            render(<ResolvedSwitch report={report} />, container);
        });
        const resolvedSwitch = document.querySelector(
            '#resolvedStatusSwitch'
        ) as HTMLInputElement;

        // Toggles the checked property of the switch
        resolvedSwitch.checked = !resolvedSwitch.checked;
        expect(resolvedSwitch.checked).toBe(!report.resolved);

        // Simulates a click on the switch which then fires the onChange event
        ReactTestUtils.act(() => {
            resolvedSwitch.dispatchEvent(
                new MouseEvent('click', { bubbles: true })
            );
        });
        expect(spy).toBeCalledWith(report._id, !report.resolved, 'feedback');
        jest.runAllTimers();
        await ReactTestUtils.act(async () => {
            await Promise.allSettled(spy.mock.results);
        });
    });
    it('Should update the resolved status of a bug report', async () => {
        const report = makeBugReport();
        const resolvedVal: AxiosResponse = {
            status: 200,
            data: {},
            statusText: 'OK',
            headers: {},
            config: {},
        };
        const spy = jest
            .spyOn(API, 'updateReportResolvedStatus')
            .mockResolvedValue(resolvedVal);
        jest.useFakeTimers();

        ReactTestUtils.act(() => {
            render(<ResolvedSwitch report={report} />, container);
        });
        const resolvedSwitch = document.querySelector(
            '#resolvedStatusSwitch'
        ) as HTMLInputElement;

        // Toggles the checked property of the switch
        resolvedSwitch.checked = !resolvedSwitch.checked;
        expect(resolvedSwitch.checked).toBe(!report.resolved);

        // Simulates a click on the switch which then fires the onChange event
        ReactTestUtils.act(() => {
            resolvedSwitch.dispatchEvent(
                new MouseEvent('click', { bubbles: true })
            );
        });
        expect(spy).toBeCalledWith(report._id, !report.resolved, 'bugs');
        jest.runAllTimers();
        await ReactTestUtils.act(async () => {
            await Promise.allSettled(spy.mock.results);
        });
    });
});
