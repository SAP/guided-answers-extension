import axios from 'axios';
import { getGuidedAnswerApi } from '../src';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Guided Answers Api: getTrees()', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Default host, should build correct request URL and convert node id string to number', async () => {
        // Mock setup
        const data = [
            {
                TREE_ID: '1',
                TITLE: 'One',
                DESCRIPTION: 'First tree',
                AVAILABILITY: 'PUBLIC',
                FIRST_NODE_ID: '100'
            },
            {
                TREE_ID: '2',
                TITLE: 'Two',
                DESCRIPTION: 'Second tree',
                AVAILABILITY: 'PUBLIC',
                FIRST_NODE_ID: '200'
            },
            {
                TREE_ID: '3',
                TITLE: 'Three',
                DESCRIPTION: 'Third tree',
                AVAILABILITY: 'PUBLIC',
                FIRST_NODE_ID: '300'
            }
        ];
        let requestUrl = '';
        mockedAxios.get.mockImplementation((url) => {
            requestUrl = url;
            return Promise.resolve({ data });
        });

        // Test execution
        const result = await getGuidedAnswerApi().getTrees();

        // Result check
        expect(requestUrl).toBe('https://ga.support.sap.com/dtp/api/trees/');
        expect(result).toEqual([
            {
                TREE_ID: 1,
                TITLE: 'One',
                DESCRIPTION: 'First tree',
                AVAILABILITY: 'PUBLIC',
                FIRST_NODE_ID: 100
            },
            {
                TREE_ID: 2,
                TITLE: 'Two',
                DESCRIPTION: 'Second tree',
                AVAILABILITY: 'PUBLIC',
                FIRST_NODE_ID: 200
            },
            {
                TREE_ID: 3,
                TITLE: 'Three',
                DESCRIPTION: 'Third tree',
                AVAILABILITY: 'PUBLIC',
                FIRST_NODE_ID: 300
            }
        ]);
    });

    test('Custom host with query, returns single entry, should build correct query and convert to array', async () => {
        // Mock setup
        const data = {
            TREE_ID: 1,
            TITLE: 'One',
            DESCRIPTION: 'First tree',
            AVAILABILITY: 'PUBLIC',
            FIRST_NODE_ID: 100
        };
        let requestUrl = '';
        mockedAxios.get.mockImplementation((url) => {
            requestUrl = url;
            return Promise.resolve({ data });
        });

        // Test execution
        const result = await getGuidedAnswerApi({ apiHost: 'https://my.custom.host' }).getTrees('ONE');

        // Result check
        expect(requestUrl).toBe('https://my.custom.host/dtp/api/trees/ONE');
        expect(result).toEqual([
            {
                TREE_ID: 1,
                TITLE: 'One',
                DESCRIPTION: 'First tree',
                AVAILABILITY: 'PUBLIC',
                FIRST_NODE_ID: 100
            }
        ]);
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
        expect(requestUrl).toBe('https://ga.support.sap.com/dtp/api/trees/1');
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
        const options = {
            enhancements: {
                nodeEnhancements: [
                    {
                        nodeId: -1,
                        command: {
                            label: 'terminal command enhancement',
                            description: 'Node enhancement with terminal command',
                            icon: '',
                            exec: {
                                cwd: '.',
                                arguments: ['launch', 'Infinite', 'Improbability', 'Drive']
                            }
                        }
                    },
                    {
                        nodeId: -1,
                        command: {
                            label: 'vscode command enhancement',
                            description: 'Node enhancement with VSCode command',
                            icon: '',
                            exec: {
                                extensionId: 'full speed',
                                commandId: 'SPEED',
                                argument: { fsPath: '' }
                            }
                        }
                    }
                ],
                htmlEnhancements: [
                    {
                        text: 'solution to all questions',
                        command: {
                            label: 'of course, 42',
                            description: `Text 'solution to all questions' decorated as link to terminal command`,
                            icon: '',
                            exec: {
                                cwd: '.',
                                arguments: ['echo', '42']
                            }
                        }
                    },
                    {
                        text: 'Body of',
                        command: {
                            label: 'what does that even mean',
                            description: `we decorate 'Body of' with a link to vscode command`,
                            icon: 'icon',
                            exec: {
                                extensionId: 'terry.exxt',
                                commandId: 'Knock kock',
                                argument: { fsPath: 'whos/there/body/of' }
                            }
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
        expect(result).toMatchSnapshot();
        expect(result.COMMANDS).toEqual(options.enhancements.nodeEnhancements.map((ne) => ne.command));
    });
});
