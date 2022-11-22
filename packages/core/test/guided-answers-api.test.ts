import axios from 'axios';
import type {
    APIOptions,
    FeedbackCommentPayload,
    FeedbackOutcomePayload,
    GuidedAnswersQueryOptions,
    GuidedAnswerTreeSearchResult
} from '@sap/guided-answers-extension-types';
import { getGuidedAnswerApi } from '../src';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const currentVersion = getGuidedAnswerApi().getApiInfo().version;

describe('Guided Answers Api: getApiInfo()', () => {
    test('Get API information', () => {
        expect(getGuidedAnswerApi().getApiInfo()).toEqual({
            host: 'https://ga.support.sap.com',
            version: currentVersion
        });
    });
});

describe('Guided Answers Api: getTrees()', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Default host, should build correct request URL and return results', async () => {
        // Mock setup
        const data: GuidedAnswerTreeSearchResult = {
            trees: [
                {
                    TREE_ID: 1,
                    TITLE: 'One',
                    DESCRIPTION: 'First tree',
                    AVAILABILITY: 'PUBLIC',
                    FIRST_NODE_ID: 100,
                    SCORE: 0.1,
                    COMPONENT: 'C1',
                    PRODUCT: 'P_one'
                },
                {
                    TREE_ID: 2,
                    TITLE: 'Two',
                    DESCRIPTION: 'Second tree',
                    AVAILABILITY: 'PUBLIC',
                    FIRST_NODE_ID: 200,
                    SCORE: 0.2,
                    COMPONENT: 'C2',
                    PRODUCT: 'P_two'
                },
                {
                    TREE_ID: 3,
                    TITLE: 'Three',
                    DESCRIPTION: 'Third tree',
                    AVAILABILITY: 'PUBLIC',
                    FIRST_NODE_ID: 300,
                    SCORE: 0.3,
                    COMPONENT: 'C3',
                    PRODUCT: 'P_three'
                }
            ],
            resultSize: 3,
            componentFilters: [{ COMPONENT: 'C1', COUNT: 1 }],
            productFilters: [{ PRODUCT: 'P_one', COUNT: 1 }]
        };
        let requestUrl = '';
        mockedAxios.get.mockImplementation((url) => {
            requestUrl = url;
            return Promise.resolve({ data });
        });

        // Test execution
        const result = await getGuidedAnswerApi().getTrees();

        // Result check
        expect(requestUrl).toBe(
            `https://ga.support.sap.com/dtp/api/${currentVersion}/trees/*?responseSize=9999&offset=0`
        );
        expect(result).toEqual({
            trees: [
                {
                    TREE_ID: 1,
                    TITLE: 'One',
                    DESCRIPTION: 'First tree',
                    AVAILABILITY: 'PUBLIC',
                    FIRST_NODE_ID: 100,
                    SCORE: 0.1,
                    COMPONENT: 'C1',
                    PRODUCT: 'P_one'
                },
                {
                    TREE_ID: 2,
                    TITLE: 'Two',
                    DESCRIPTION: 'Second tree',
                    AVAILABILITY: 'PUBLIC',
                    FIRST_NODE_ID: 200,
                    SCORE: 0.2,
                    COMPONENT: 'C2',
                    PRODUCT: 'P_two'
                },
                {
                    TREE_ID: 3,
                    TITLE: 'Three',
                    DESCRIPTION: 'Third tree',
                    AVAILABILITY: 'PUBLIC',
                    FIRST_NODE_ID: 300,
                    SCORE: 0.3,
                    COMPONENT: 'C3',
                    PRODUCT: 'P_three'
                }
            ],
            resultSize: 3,
            componentFilters: [{ COMPONENT: 'C1', COUNT: 1 }],
            productFilters: [{ PRODUCT: 'P_one', COUNT: 1 }]
        });
    });

    test('Custom host with query, returns single entry, should build correct query and convert to array', async () => {
        // Mock setup
        const data = {
            trees: [
                {
                    TREE_ID: 1,
                    TITLE: 'One',
                    DESCRIPTION: 'First tree',
                    AVAILABILITY: 'PUBLIC',
                    FIRST_NODE_ID: 100,
                    SCORE: 0.999
                }
            ]
        };
        let requestUrl = '';
        mockedAxios.get.mockImplementation((url) => {
            requestUrl = url;
            return Promise.resolve({ data });
        });

        // Test execution
        const result = await getGuidedAnswerApi({ apiHost: 'https://my.custom.host' }).getTrees({ query: 'ONE' });

        // Result check
        expect(requestUrl).toBe(
            `https://my.custom.host/dtp/api/${currentVersion}/trees/%22ONE%22?responseSize=9999&offset=0`
        );
        expect(result).toEqual({
            trees: [
                {
                    TREE_ID: 1,
                    TITLE: 'One',
                    DESCRIPTION: 'First tree',
                    AVAILABILITY: 'PUBLIC',
                    FIRST_NODE_ID: 100,
                    SCORE: 0.999
                }
            ]
        });
    });

    test('Test non compliant response', async () => {
        // Mock setup
        mockedAxios.get.mockImplementation(() => {
            return Promise.resolve({});
        });

        try {
            // Test execution
            await getGuidedAnswerApi({ apiHost: 'anyhost' }).getTrees();
            fail('function getTrees() should have thrown an error because wrong response format, but did not.');
        } catch (error: any) {
            // Result check
            expect(error.message).toContain('anyhost');
        }
    });

    test('Test non compliant request where query is of type number)', async () => {
        try {
            // Test execution
            await getGuidedAnswerApi({ apiHost: 'other:host' }).getTrees({
                query: 1
            } as unknown as GuidedAnswersQueryOptions);
            fail('function getTrees() should have thrown an error because called with number query instead of string');
        } catch (error: any) {
            // Result check
            expect(error.message).toContain('getTreeById()');
        }
    });

    test('Test with filter and query', async () => {
        // Mock setup
        const options: GuidedAnswersQueryOptions = {
            query: 'QUERY',
            filters: {
                component: ['COMP-1`', 'COMP-2'],
                product: ['P1', 'P2']
            }
        };
        let requestUrl = '';
        mockedAxios.get.mockImplementation((url) => {
            requestUrl = url;
            return Promise.resolve({ data: { trees: [] } });
        });

        // Test execution
        await getGuidedAnswerApi({ apiHost: 'anyhost' }).getTrees(options);

        // Result check
        expect(requestUrl).toEqual(
            `anyhost/dtp/api/${currentVersion}/trees/%22QUERY%22?component=%22COMP-1%60%22,%22COMP-2%22&product=%22P1%22,%22P2%22&responseSize=9999&offset=0`
        );
    });

    test('Test with filter no query', async () => {
        // Mock setup
        const options: GuidedAnswersQueryOptions = {
            filters: {
                component: ['COMP-1`', 'COMP-2'],
                product: ['P1', 'P2']
            }
        };
        let requestUrl = '';
        mockedAxios.get.mockImplementation((url) => {
            requestUrl = url;
            return Promise.resolve({ data: { trees: [] } });
        });

        // Test execution
        await getGuidedAnswerApi({ apiHost: 'anyhost' }).getTrees(options);

        // Result check
        expect(requestUrl).toEqual(
            `anyhost/dtp/api/${currentVersion}/trees/*?component=%22COMP-1%60%22,%22COMP-2%22&product=%22P1%22,%22P2%22&responseSize=9999&offset=0`
        );
    });

    test('Test product filter only', async () => {
        // Mock setup
        const options: GuidedAnswersQueryOptions = {
            filters: {
                product: ['PRODUCT']
            }
        };
        let requestUrl = '';
        mockedAxios.get.mockImplementation((url) => {
            requestUrl = url;
            return Promise.resolve({ data: { trees: [] } });
        });

        // Test execution
        await getGuidedAnswerApi({ apiHost: 'anyhost' }).getTrees(options);

        // Result check
        expect(requestUrl).toEqual(
            `anyhost/dtp/api/${currentVersion}/trees/*?product=%22PRODUCT%22&responseSize=9999&offset=0`
        );
    });

    test('Test component filter only (also lot of special chars)', async () => {
        // Mock setup
        const options: GuidedAnswersQueryOptions = {
            filters: {
                component: ['COMPONENT`', '1-COMPONENT"!@#$%^&*()_+<>,.?/|{}[];\':"+_with special chars']
            }
        };
        let requestUrl = '';
        mockedAxios.get.mockImplementation((url) => {
            requestUrl = url;
            return Promise.resolve({ data: { trees: [] } });
        });

        // Test execution
        await getGuidedAnswerApi({ apiHost: 'anyhost' }).getTrees(options);

        // Result check
        expect(requestUrl).toEqual(
            `anyhost/dtp/api/${currentVersion}/trees/*?component=%22COMPONENT%60%22,%221-COMPONENT%22!%40%23%24%25%5E%26*()_%2B%3C%3E%2C.%3F%2F%7C%7B%7D%5B%5D%3B'%3A%22%2B_with%20special%20chars%22&responseSize=9999&offset=0`
        );
    });

    test('Test paging parameters', async () => {
        // Mock setup
        const options: GuidedAnswersQueryOptions = {
            paging: {
                responseSize: 2,
                offset: 1
            }
        };
        let requestUrl = '';
        mockedAxios.get.mockImplementation((url) => {
            requestUrl = url;
            return Promise.resolve({ data: { trees: [] } });
        });

        // Test execution
        await getGuidedAnswerApi({ apiHost: 'otherhost' }).getTrees(options);

        // Result check
        expect(requestUrl).toEqual(`otherhost/dtp/api/${currentVersion}/trees/*?responseSize=2&offset=1`);
    });
});

describe('Guided Answers Api: getTreeById()', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Get tree by id, should return tree node', async () => {
        // Mock setup
        const data = [
            {
                TREE_ID: 1,
                TITLE: 'Single',
                DESCRIPTION: 'Single tree',
                AVAILABILITY: 'PUBLIC',
                FIRST_NODE_ID: 111
            }
        ];
        let requestUrl = '';
        mockedAxios.get.mockImplementation((url) => {
            requestUrl = url;
            return Promise.resolve({ data });
        });

        // Test execution
        const result = await getGuidedAnswerApi().getTreeById(1);

        // Result check
        expect(requestUrl).toBe(`https://ga.support.sap.com/dtp/api/${currentVersion}/trees/1`);
        expect(result).toEqual({
            TREE_ID: 1,
            TITLE: 'Single',
            DESCRIPTION: 'Single tree',
            AVAILABILITY: 'PUBLIC',
            FIRST_NODE_ID: 111
        });
    });

    test('Get tree by id that does not exists, should throw error', async () => {
        // Mock setup
        mockedAxios.get.mockImplementation(() => Promise.resolve({ data: [] }));

        // Test execution
        try {
            await getGuidedAnswerApi().getTreeById(-1);
            fail('getTreeById() should have thrown exception but did not.');
        } catch (error: any) {
            // Result check
            expect(error.message).toContain('-1');
        }
    });
});

describe('Guided Answers Api: getNodeById()', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Get node by id, should return the node', async () => {
        // Mock setup
        const data = {
            NODE_ID: 123,
            TITLE: 'Node',
            BODY: `<p>Body of node 123 <img src="services/backend.xsjs?cmd=viewImage&amp;id=1" width="200" height="100" /><script>alert("evil");</script></p>`,
            QUESTION: 'How are you?',
            EDGES: [
                {
                    LABEL: 'Good',
                    TARGET_NODE: 1234,
                    ORD: 1
                },
                {
                    LABEL: 'Hanging in',
                    TARGET_NODE: 12345,
                    ORD: 2
                }
            ]
        };
        mockedAxios.get.mockImplementation(() => Promise.resolve({ data }));

        // Test execution
        const result = await getGuidedAnswerApi().getNodeById(123);

        // Result check
        expect(result).toMatchSnapshot();
    });

    test('Get node by id, node enhanced, should return enhanced node', async () => {
        // Mock setup
        const data = {
            NODE_ID: -1,
            TITLE: 'Forty-two',
            BODY: `<p>Body of solution to all questions <img src="services/backend.xsjs?cmd=viewImage&amp;id=1" width="200" height="100" /><script>alert("evil");</script></p>`,
            QUESTION: 'Answer to the Ultimate Question of Life, the Universe, and Everything',
            EDGES: [
                {
                    LABEL: 'Yes',
                    TARGET_NODE: 42,
                    ORD: 1
                },
                {
                    LABEL: 'No',
                    TARGET_NODE: Infinity,
                    ORD: 2
                }
            ]
        };
        const options: APIOptions = {
            enhancements: {
                nodeEnhancements: [
                    {
                        nodeId: -1,
                        command: {
                            label: 'terminal command enhancement',
                            description: 'Node enhancement with terminal command',
                            exec: {
                                cwd: '.',
                                arguments: ['launch', 'Infinite', 'Improbability', 'Drive']
                            },
                            environment: ['VSCODE', 'SBAS']
                        }
                    },
                    {
                        nodeId: -1,
                        command: {
                            label: 'vscode command enhancement',
                            description: 'Node enhancement with VSCode command',
                            exec: {
                                extensionId: 'full speed',
                                commandId: 'SPEED',
                                argument: { fsPath: '' }
                            },
                            environment: ['VSCODE', 'SBAS']
                        }
                    }
                ],
                htmlEnhancements: [
                    {
                        text: 'solution to all questions',
                        command: {
                            label: 'of course, 42',
                            description: `Text 'solution to all questions' decorated as link to terminal command`,
                            exec: {
                                cwd: '.',
                                arguments: ['echo', '42']
                            },
                            environment: ['VSCODE', 'SBAS']
                        }
                    },
                    {
                        text: 'Body of',
                        command: {
                            label: 'what does that even mean',
                            description: `we decorate 'Body of' with a link to vscode command`,
                            exec: {
                                extensionId: 'terry.exxt',
                                commandId: 'Knock kock',
                                argument: { fsPath: 'whos/there/body/of' }
                            },
                            environment: ['VSCODE', 'SBAS']
                        }
                    }
                ]
            }
        };
        let requestUrl = '';
        mockedAxios.get.mockImplementation((url) => {
            requestUrl = url;
            return Promise.resolve({ data });
        });
        // Test execution
        const result = await getGuidedAnswerApi(options).getNodeById(-1);

        // Result check
        expect(requestUrl).toBe(`https://ga.support.sap.com/dtp/api/${currentVersion}/nodes/-1`);
        expect(result).toMatchSnapshot();
        expect(result.COMMANDS).toEqual(options.enhancements?.nodeEnhancements?.map((ne) => ne.command));
    });

    test('Get node with different images, should add host to src where applicable', async () => {
        // Mock setup
        mockedAxios.get.mockImplementation(() =>
            Promise.resolve({
                data: {
                    BODY: '<img src="services/backend.xsjs?no-extra-attributes" /><img width="321" src="services/backend.xsjs?with-attribute=width;height" height="123" /><img width="111" src="https://any.host/services/backend.xsjs?" height="222" />'
                }
            })
        );

        // Test execution
        const result = await getGuidedAnswerApi({ apiHost: 'http://host' }).getNodeById(1);

        //Result check
        expect(result.BODY).toBe(
            '<img src="http://host/dtp/viewer/services/backend.xsjs?no-extra-attributes" /><img width="321" src="http://host/dtp/viewer/services/backend.xsjs?with-attribute=width;height" height="123" /><img width="111" src="https://any.host/services/backend.xsjs?" height="222" />'
        );
    });
});

describe('Guided Answers Api: getNodePath()', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Get node path, node enhanced, should return list of enhanced nodes', async () => {
        // Mock setup
        const nodes = [
            {
                NODE_ID: 111,
                TITLE: 'Onehundredeleven',
                BODY: '<p>This is node Onehundredeleven</p>',
                QUESTION: 'Where next',
                EDGES: [
                    { LABEL: 'Next', TARGET_NODE: 112, ORD: 1 },
                    { LABEL: 'Somewhere else', TARGET_NODE: 911, ORD: 2 }
                ]
            },
            {
                NODE_ID: 112,
                TITLE: 'Onehundredtwelve',
                BODY: '<p>This is node Onehundredtwelve</p>',
                QUESTION: 'Nowhere else to go',
                EDGES: []
            }
        ];

        const options: APIOptions = {
            enhancements: {
                nodeEnhancements: [],
                htmlEnhancements: [
                    {
                        text: 'Onehundredtwelve',
                        command: {
                            label: 'Command for Onehundredtwelve',
                            description: `Command to enhance node in path`,
                            exec: {
                                cwd: '/',
                                arguments: ['TEST']
                            },
                            environment: ['VSCODE', 'SBAS']
                        }
                    }
                ]
            }
        };
        mockedAxios.get.mockImplementation((url: string) => {
            const data = nodes.find((n) => url.endsWith(`/${n.NODE_ID}`));
            if (data) {
                return Promise.resolve({ data });
            } else {
                return Promise.reject('node not found');
            }
        });

        // Test execution
        const result = await getGuidedAnswerApi(options).getNodePath([111, 112]);

        // Result check
        expect(result).toMatchSnapshot();
    });
});

describe('Guided Answers Api: sendFeedbackComment()', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Send comment, should be successful', async () => {
        // Mock setup
        const feedbackCommentPayload: FeedbackCommentPayload = {
            treeId: 1,
            nodeId: 2,
            comment: 'This is a mock comment'
        };
        const postMock = mockedAxios.post.mockImplementation(() =>
            Promise.resolve({
                status: 200
            })
        );

        // Test execution
        await getGuidedAnswerApi({ apiHost: 'any.host' }).sendFeedbackComment(feedbackCommentPayload);

        // Result check
        expect(postMock).toBeCalledWith(`any.host/dtp/api/${currentVersion}/feedback/comment`, {
            treeId: 1,
            nodeId: 2,
            message: 'This is a mock comment'
        });
    });

    test('Send feedback, should not be successful', async () => {
        // Mock setup
        const feedbackCommentPayload: FeedbackCommentPayload = {
            treeId: 9,
            nodeId: 8,
            comment: ''
        };
        mockedAxios.post.mockImplementation(() =>
            Promise.resolve({
                status: 404
            })
        );

        // Test execution
        try {
            await getGuidedAnswerApi().sendFeedbackComment(feedbackCommentPayload);
            fail('Function sendFeedbackComment() should have thrown error but did not');
        } catch (error) {
            // Result check
            expect(error instanceof Error).toBeTruthy();
            if (error instanceof Error) {
                expect(error.message).toContain('404');
            }
        }
    });
});

describe('Guided Answers Api: sendFeedbackOutcome()', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Send outcome: solved', async () => {
        // Mock setup
        const feedbackOutcomePayload: FeedbackOutcomePayload = {
            treeId: 10,
            nodeId: 20,
            solved: true
        };
        const postMock = mockedAxios.post.mockImplementation(() =>
            Promise.resolve({
                status: 200
            })
        );

        // Test execution
        await getGuidedAnswerApi({ apiHost: 'mock.host' }).sendFeedbackOutcome(feedbackOutcomePayload);

        // Result check
        expect(postMock).toBeCalledWith(`mock.host/dtp/api/${currentVersion}/feedback/outcome`, {
            treeId: 10,
            nodeId: 20,
            message: 'Solved'
        });
    });

    test('Send outcome: not solved', async () => {
        // Mock setup
        const feedbackOutcomePayload: FeedbackOutcomePayload = {
            treeId: 11,
            nodeId: 22,
            solved: false
        };
        const postMock = mockedAxios.post.mockImplementation(() =>
            Promise.resolve({
                status: 200
            })
        );

        // Test execution
        await getGuidedAnswerApi({ apiHost: 'mock.host' }).sendFeedbackOutcome(feedbackOutcomePayload);

        // Result check
        expect(postMock).toBeCalledWith(`mock.host/dtp/api/${currentVersion}/feedback/outcome`, {
            treeId: 11,
            nodeId: 22,
            message: 'Not Solved'
        });
    });
});
