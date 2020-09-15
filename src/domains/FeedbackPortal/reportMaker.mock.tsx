// eslint-disable-next-line import/no-extraneous-dependencies
import faker from 'faker';
import { FeedbackReport, BugReport } from './types';

const recent = faker.date.recent();
const future = faker.date.future();

export function makeReply() {
    return {
        content: faker.lorem.paragraph(),
        repliedBy: {
            _id: faker.random.alphaNumeric(12),
        },
        repliedDate: faker.date.past().toISOString(),
    };
}

export function makeReplies(numberOfReplies: number) {
    const replies = [];
    for (let i = 0; i < numberOfReplies; i += 1) {
        replies.push(makeReply());
    }
    return replies;
}

export function makeFeedbackReport(): FeedbackReport {
    return {
        _id: faker.random.alphaNumeric(12),
        description: faker.lorem.paragraph(),
        date: faker.date.between(recent, future).toISOString(),
        submitterId: faker.random.alphaNumeric(12),
        type: 'Feedback',
        replies: makeReplies(3),
        resolved: false,
    };
}

export function makeBugReport(): BugReport {
    return {
        _id: faker.random.alphaNumeric(12),
        description: faker.lorem.paragraph(),
        date: faker.date.between(recent, future).toISOString(),
        townhallId: faker.random.alphaNumeric(12),
        submitterId: faker.random.alphaNumeric(12),
        type: 'Bug',
        replies: [],
        resolved: faker.random.boolean(),
    };
}
