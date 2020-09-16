/* eslint-disable @typescript-eslint/require-await */
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import faker from 'faker';
import { AxiosResponse } from 'axios';

import ResolvedSwitch from './ResolvedSwitch';
import * as API from '../api/api'; // babel issues ref: https://stackoverflow.com/questions/53162001/typeerror-during-jests-spyon-cannot-set-property-getrequest-of-object-which

jest.mock('hooks/useSnack');

describe('Reply Form', () => {
    let container: HTMLDivElement | null = null;
    let reportId: string;
    let reportResolvedStatus: boolean;

    beforeEach(() => {
        reportId = faker.random.alphaNumeric(12);
        reportResolvedStatus = faker.random.boolean();
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
            render(
                <ResolvedSwitch
                    reportId={reportId}
                    reportResolvedStatus={reportResolvedStatus}
                    reportType='feedback'
                />,
                container
            );
        });
    });
    it('Should render a switch with the appropriate checked attribute', async () => {
        ReactTestUtils.act(() => {
            render(
                <ResolvedSwitch
                    reportId={reportId}
                    reportResolvedStatus={reportResolvedStatus}
                    reportType='feedback'
                />,
                container
            );
        });
        const resolvedSwitch = document.querySelector(
            '#resolvedStatusSwitch'
        ) as HTMLInputElement;
        expect(resolvedSwitch.checked).toBe(reportResolvedStatus);
    });
    it('Should update the resolved status of a feedback report', async () => {
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
            render(
                <ResolvedSwitch
                    reportId={reportId}
                    reportResolvedStatus={reportResolvedStatus}
                    reportType='feedback'
                />,
                container
            );
        });
        const resolvedSwitch = document.querySelector(
            '#resolvedStatusSwitch'
        ) as HTMLInputElement;

        // Toggles the checked property of the switch
        resolvedSwitch.checked = !resolvedSwitch.checked;
        expect(resolvedSwitch.checked).toBe(!reportResolvedStatus);

        // Simulates a click on the switch which then fires the onChange event
        ReactTestUtils.act(() => {
            resolvedSwitch.dispatchEvent(
                new MouseEvent('click', { bubbles: true })
            );
        });
        expect(spy).toBeCalledWith(reportId, !reportResolvedStatus, 'feedback');
        jest.runAllTimers();
        await ReactTestUtils.act(async () => {
            await Promise.allSettled(spy.mock.results);
        });
    });
    it('Should update the resolved status of a bug report', async () => {
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
            render(
                <ResolvedSwitch
                    reportId={reportId}
                    reportResolvedStatus={reportResolvedStatus}
                    reportType='bugs'
                />,
                container
            );
        });
        const resolvedSwitch = document.querySelector(
            '#resolvedStatusSwitch'
        ) as HTMLInputElement;

        // Toggles the checked property of the switch
        resolvedSwitch.checked = !resolvedSwitch.checked;
        expect(resolvedSwitch.checked).toBe(!reportResolvedStatus);

        // Simulates a click on the switch which then fires the onChange event
        ReactTestUtils.act(() => {
            resolvedSwitch.dispatchEvent(
                new MouseEvent('click', { bubbles: true })
            );
        });
        expect(spy).toBeCalledWith(reportId, !reportResolvedStatus, 'bugs');
        jest.runAllTimers();
        await ReactTestUtils.act(async () => {
            await Promise.allSettled(spy.mock.results);
        });
    });
});
