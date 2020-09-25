/* eslint-disable @typescript-eslint/unbound-method */
import axios from 'utils/axios';
import errors from 'utils/errors';
import faker from 'faker';

import * as API from '.';

// Creates a mocked axios.post function but also tracks calls to axios.post
beforeEach(() => {
    jest.spyOn(axios, 'post');
    jest.spyOn(axios, 'get');
});

// Resets the state of all mocks.
afterEach(() => {
    jest.restoreAllMocks();
});

describe('#FeedbackReports', () => {
    describe('#create', () => {
        const form = {
            description: faker.lorem.paragraphs(),
        };

        it('should reject the feedback report because of missing description', async () => {
            await expect(API.createFeedbackReport({})).rejects.toThrow(
                errors.fieldError()
            );
            expect(axios.post).not.toHaveBeenCalled();
        });

        it('should create a feedback report', async () => {
            const resolvedValue = { status: 200 };

            // Makes the mocked axios.post call to return a status of 200
            (axios as jest.Mocked<typeof axios>).post.mockResolvedValue(
                resolvedValue
            );
            // .resolves makes Jest wait for the mocked API call to resolve
            // .toBe is the expected value returned from the mocked API call
            await expect(API.createFeedbackReport(form)).resolves.toBe(
                resolvedValue
            );
            // .toHaveBeenCalledWith ensures that the mocked API call function was called with specific arguments (endpoint and body).
            expect(axios.post).toHaveBeenCalledWith(
                '/api/feedback/create-report',
                {
                    ...form,
                }
            );
        });
    });

    describe('#get', () => {
        const page = faker.random.number();
        const limit = faker.random.number();
        const sortByDate = 'false';
        const submitterId = faker.random.alphaNumeric(12);
        it('should reject since page number is not provided', async () => {
            await expect(
                API.getFeedbackReportsBySubmitter(
                    0,
                    limit,
                    sortByDate,
                    submitterId
                )
            ).rejects.toThrow(errors.internalError());
            expect(axios.get).not.toHaveBeenCalled();
        });
        it('should reject since limit is not provided', async () => {
            await expect(
                API.getFeedbackReportsBySubmitter(
                    page,
                    0,
                    sortByDate,
                    submitterId
                )
            ).rejects.toThrow(errors.internalError());
            expect(axios.get).not.toHaveBeenCalled();
        });
        it('should reject since sortByDate is not provided', async () => {
            await expect(
                API.getFeedbackReportsBySubmitter(page, limit, '', submitterId)
            ).rejects.toThrow(errors.fieldError());
            expect(axios.get).not.toHaveBeenCalled();
        });

        it('should reject since submitterId is not provided', async () => {
            await expect(
                API.getFeedbackReportsBySubmitter(page, limit, sortByDate, '')
            ).rejects.toThrow(errors.internalError());
            expect(axios.get).not.toHaveBeenCalled();
        });

        it('should get feedback reports', async () => {
            const resolvedValue = { status: 200 };
            (axios as jest.Mocked<typeof axios>).get.mockResolvedValue(
                resolvedValue
            );
            await expect(
                API.getFeedbackReportsBySubmitter(
                    page,
                    limit,
                    sortByDate,
                    submitterId
                )
            ).resolves.toBe(resolvedValue);
            expect(axios.get).toHaveBeenCalledWith(
                `/api/feedback/get-reports/${submitterId}`,
                {
                    params: {
                        page,
                        limit,
                        sortByDate,
                    },
                }
            );
        });
    });

    describe('#update', () => {
        const form = {
            description: 'This is a feedback report',
            _id: '507f1f77bcf86cd799439011',
        };
        it('should reject update', async () => {
            await expect(API.updateFeedbackReport({})).rejects.toThrow(
                errors.fieldError()
            );
            expect(axios.post).not.toHaveBeenCalled();
        });
        it('should update a feedback report', async () => {
            const resolvedValue = { status: 200 };
            (axios as jest.Mocked<typeof axios>).post.mockResolvedValue(
                resolvedValue
            );
            await expect(API.updateFeedbackReport(form)).resolves.toBe(
                resolvedValue
            );
            expect(axios.post).toHaveBeenCalledWith(
                '/api/feedback/update-report',
                {
                    _id: form._id,
                    newDescription: form.description,
                }
            );
        });
    });

    describe('#delete', () => {
        const _id = faker.random.alphaNumeric(12);
        it('should reject delete', async () => {
            await expect(API.deleteFeedbackReport('')).rejects.toThrow(
                errors.internalError()
            );
            expect(axios.post).not.toHaveBeenCalled();
        });
        it('should delete a feedback report', async () => {
            const resolvedValue = { status: 200 };
            (axios as jest.Mocked<typeof axios>).post.mockResolvedValue(
                resolvedValue
            );
            await expect(API.deleteFeedbackReport(_id)).resolves.toBe(
                resolvedValue
            );
            expect(axios.post).toHaveBeenCalledWith(
                '/api/feedback/delete-report',
                {
                    _id,
                }
            );
        });
    });
});

describe('#BugReports', () => {
    describe('#create', () => {
        const form = {
            description: 'This is a bug report',
        };
        const townhallId = faker.random.alphaNumeric(12);

        it('should reject the bug report since form body is not provided', async () => {
            await expect(API.createBugReport({}, townhallId)).rejects.toThrow(
                errors.fieldError()
            );
            expect(axios.post).not.toHaveBeenCalled();
        });
        it('should reject the bug report since townhallId is not provided', async () => {
            await expect(API.createBugReport(form, '')).rejects.toThrow(
                errors.internalError()
            );
            expect(axios.post).not.toHaveBeenCalled();
        });
        it('should create a bug report', async () => {
            const resolvedValue = { status: 200 };
            (axios as jest.Mocked<typeof axios>).post.mockResolvedValue(
                resolvedValue
            );
            await expect(API.createBugReport(form, townhallId)).resolves.toBe(
                resolvedValue
            );
            expect(axios.post).toHaveBeenCalledWith('/api/bugs/create-report', {
                ...form,
                townhallId,
            });
        });
    });

    describe('#get', () => {
        const page = faker.random.number();
        const limit = faker.random.number();
        const sortByDate = 'true';
        const submitterId = faker.random.alphaNumeric(12);

        it('should reject since page number is not provided', async () => {
            await expect(
                API.getBugReportsBySubmitter(0, limit, sortByDate, submitterId)
            ).rejects.toThrow(errors.internalError());
            expect(axios.get).not.toHaveBeenCalled();
        });

        it('should reject since limit is not provided', async () => {
            await expect(
                API.getBugReportsBySubmitter(page, 0, sortByDate, submitterId)
            ).rejects.toThrow(errors.internalError());
            expect(axios.get).not.toHaveBeenCalled();
        });

        it('should reject since sortByDate is not provided', async () => {
            await expect(
                API.getBugReportsBySubmitter(page, limit, '', submitterId)
            ).rejects.toThrow(errors.fieldError());
            expect(axios.get).not.toHaveBeenCalled();
        });

        it('should reject since submitterId is not provided', async () => {
            await expect(
                API.getBugReportsBySubmitter(page, limit, sortByDate, '')
            ).rejects.toThrow(errors.internalError());
            expect(axios.get).not.toHaveBeenCalled();
        });

        it('should get bug reports', async () => {
            const resolvedValue = { status: 200 };
            (axios as jest.Mocked<typeof axios>).get.mockResolvedValue(
                resolvedValue
            );
            await expect(
                API.getBugReportsBySubmitter(
                    page,
                    limit,
                    sortByDate,
                    submitterId
                )
            ).resolves.toBe(resolvedValue);
            expect(axios.get).toHaveBeenCalledWith(
                `/api/bugs/get-reports/${submitterId}`,
                {
                    params: {
                        page,
                        limit,
                        sortByDate,
                    },
                }
            );
        });
    });

    describe('#update', () => {
        const form = {
            description: 'This is a bug report',
            _id: faker.random.alphaNumeric(12),
        };
        it('should reject update', async () => {
            await expect(API.updateBugReport({})).rejects.toThrow(
                errors.fieldError()
            );
            expect(axios.post).not.toHaveBeenCalled();
        });
        it('should update a bug report', async () => {
            const resolvedValue = { status: 200 };
            (axios as jest.Mocked<typeof axios>).post.mockResolvedValue(
                resolvedValue
            );
            await expect(API.updateBugReport(form)).resolves.toBe(
                resolvedValue
            );
            expect(axios.post).toHaveBeenCalledWith('/api/bugs/update-report', {
                _id: form._id,
                newDescription: form.description,
            });
        });
    });

    describe('#delete', () => {
        const _id = faker.random.alphaNumeric(12);
        it('should reject delete', async () => {
            await expect(API.deleteBugReport('')).rejects.toThrow(
                errors.internalError()
            );
            expect(axios.post).not.toHaveBeenCalled();
        });
        it('should delete a bug report', async () => {
            const resolvedValue = { status: 200 };
            (axios as jest.Mocked<typeof axios>).post.mockResolvedValue(
                resolvedValue
            );
            await expect(API.deleteBugReport(_id)).resolves.toBe(resolvedValue);
            expect(axios.post).toHaveBeenCalledWith('/api/bugs/delete-report', {
                _id,
            });
        });
    });
});

describe('#update resolved status', () => {
    const _id = faker.random.alphaNumeric(12);
    it('should reject update of resolved status. Missing report Id', async () => {
        await expect(
            API.updateReportResolvedStatus('', true, 'feedback')
        ).rejects.toThrow(errors.internalError());
        expect(axios.post).not.toHaveBeenCalled();
    });
    it('should reject update of resolved status. Missing resolved value', async () => {
        await expect(
            API.updateReportResolvedStatus(_id, undefined, 'bug')
        ).rejects.toThrow(errors.internalError());
        expect(axios.post).not.toHaveBeenCalled();
    });
    it('should reject update of resolved status. Missing report type', async () => {
        await expect(
            API.updateReportResolvedStatus(_id, false, '') // eslint-disable-line
        ).rejects.toThrow(errors.internalError());
        expect(axios.post).not.toHaveBeenCalled();
    });
    it('should update the resolved status of a bug report', async () => {
        const resolvedValue = { status: 200 };
        (axios as jest.Mocked<typeof axios>).post.mockResolvedValue(
            resolvedValue
        );
        await expect(
            API.updateReportResolvedStatus(_id, true, 'bugs')
        ).resolves.toBe(resolvedValue);
        expect(axios.post).toHaveBeenCalledWith(
            `/api/bugs/update-resolved-status/${_id}`,
            {
                resolvedStatus: true,
            }
        );
    });
    it('should update the resolved status of a feedback report', async () => {
        const resolvedValue = { status: 200 };
        (axios as jest.Mocked<typeof axios>).post.mockResolvedValue(
            resolvedValue
        );
        await expect(
            API.updateReportResolvedStatus(_id, false, 'feedback')
        ).resolves.toBe(resolvedValue);
        expect(axios.post).toHaveBeenCalledWith(
            `/api/feedback/update-resolved-status/${_id}`,
            {
                resolvedStatus: false,
            }
        );
    });
});

describe('#reply to report', () => {
    const _id = faker.random.alphaNumeric(12);
    it('should reject reply to report. Missing report Id', async () => {
        await expect(
            API.replyToReport('', faker.lorem.paragraph(), 'feedback')
        ).rejects.toThrow(errors.internalError());
        expect(axios.post).not.toHaveBeenCalled();
    });
    it('should reject reply to report. Missing reply content', async () => {
        await expect(API.replyToReport(_id, '', 'bugs')).rejects.toThrow(
            errors.fieldError()
        );
        expect(axios.post).not.toHaveBeenCalled();
    });
    it('should reject reply to report. Missing report type', async () => {
        await expect(
            API.replyToReport(_id, faker.lorem.paragraph(), '')
        ).rejects.toThrow(errors.internalError());
        expect(axios.post).not.toHaveBeenCalled();
    });
    it('should submit reply to feedback report', async () => {
        const replyContent = faker.lorem.paragraph();
        const resolvedValue = { status: 200 };
        (axios as jest.Mocked<typeof axios>).post.mockResolvedValue(
            resolvedValue
        );
        await expect(
            API.replyToReport(_id, replyContent, 'feedback')
        ).resolves.toBe(resolvedValue);
        expect(axios.post).toHaveBeenCalledWith(
            `/api/feedback/reply-to/${_id}`,
            {
                replyContent,
            }
        );
    });
    it('should submit reply to bug report', async () => {
        const replyContent = faker.lorem.paragraph();
        const resolvedValue = { status: 200 };
        (axios as jest.Mocked<typeof axios>).post.mockResolvedValue(
            resolvedValue
        );
        await expect(
            API.replyToReport(_id, replyContent, 'bugs')
        ).resolves.toBe(resolvedValue);
        expect(axios.post).toHaveBeenCalledWith(`/api/bugs/reply-to/${_id}`, {
            replyContent,
        });
    });
});
