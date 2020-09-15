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
    const reportId = faker.random.alphaNumeric(12);
    const reportResolvedStatus = faker.random.boolean();

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
            render(
                <ResolvedSwitch
                    reportId={reportId}
                    reportResolvedStatus={reportResolvedStatus}
                    apiEndpoint='feedback'
                />,
                container
            );
        });
    });
    // it('Should update the resolved status of a feedback report', async () => {
    //     const resolvedVal: AxiosResponse = {
    //         status: 200,
    //         data: {},
    //         statusText: 'OK',
    //         headers: {},
    //         config: {},
    //     };
    //     const spy = jest
    //         .spyOn(API, 'updateReportResolvedStatus')
    //         .mockResolvedValue(resolvedVal);
    //     jest.useFakeTimers();

    //     ReactTestUtils.act(() => {
    //         render(
    //             <ResolvedSwitch
    //                 reportId={reportId}
    //                 reportResolvedStatus={reportResolvedStatus}
    //                 apiEndpoint='feedback'
    //             />,
    //             container
    //         );
    //     });
    //     const resolvedSwitch = document.querySelector(
    //         '[type="checkbox"]'
    //     ) as HTMLInputElement;

    //     expect(resolvedSwitch.checked).toBe(reportResolvedStatus);
    //     ReactTestUtils.act(() => {
    //         ReactTestUtils.Simulate.change(resolvedSwitch, {
    //             target: ({
    //                 checked: true,
    //             } as unknown) as EventTarget,
    //         });
    //     });
    //     expect(resolvedSwitch.checked).toBe(!reportResolvedStatus);

    //     expect(spy).toBeCalledWith(reportId, !reportResolvedStatus, 'feedback');
    //     jest.runAllTimers();
    //     await ReactTestUtils.act(async () => {
    //         await Promise.allSettled(spy.mock.results);
    //     });
    // });
});
