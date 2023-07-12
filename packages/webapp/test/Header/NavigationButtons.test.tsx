import { treeMock } from '../__mocks__/treeMock';
import React from 'react';
import { actions } from '../../src/webview/state';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import {
    HomeButton,
    BackButton,
    RestartButton,
    ShareButton,
    BookmarkButton
} from '../../src/webview/ui/components/Header/NavigationButtons';
import { initI18n } from '../../src/webview/i18n';
import configureMockStore from 'redux-mock-store';
import { getInitialState, reducer } from '../../src/webview/state/reducers';
import { AppState } from '../../src/webview/types';
import { Provider } from 'react-redux';

jest.mock('../../src/webview/state', () => {
    return {
        actions: {
            goToHomePage: jest.fn(),
            goToPreviousPage: jest.fn(),
            restartAnswer: jest.fn(),
            fillShareLinks: jest.fn(),
            shareLinkTelemetry: jest.fn(),
            copyLinkTelemetry: jest.fn(),
            updateBookmark: jest.fn()
        }
    };
});

const createState = (initialState: AppState) => (actions: any[]) => actions.reduce(reducer, initialState);
const mockStore = configureMockStore();

describe('<HomeButton />', () => {
    initI18n();
    afterEach(cleanup);

    it('Should render a HomeButton component', () => {
        const { container } = render(<HomeButton />);
        expect(container).toMatchSnapshot();

        //Test click event
        const element = screen.getByTestId('home-button');
        fireEvent.click(element);
        expect(actions.goToHomePage).toBeCalled();
    });
});

describe('<BackButton />', () => {
    initI18n();
    afterEach(cleanup);

    it('Should render a BackButton component', () => {
        const { container } = render(<BackButton />);
        expect(container).toMatchSnapshot();

        //Test click event
        const element = screen.getByTestId('back-button');
        fireEvent.click(element);
        expect(actions.goToPreviousPage).toBeCalled();
    });
});

describe('<RestartButton />', () => {
    initI18n();
    afterEach(cleanup);

    it('Should render a RestartButton component', () => {
        const { container } = render(<RestartButton />);
        expect(container).toMatchSnapshot();

        //Test click event
        const element = screen.getByTestId('restart-button');
        fireEvent.click(element);
        expect(actions.restartAnswer).toBeCalled();
    });
});

describe('<ShareButton />', () => {
    initI18n();
    afterEach(cleanup);

    const stateWithActiveAnswer = getInitialState();

    stateWithActiveAnswer.activeGuidedAnswer = treeMock;
    stateWithActiveAnswer.activeGuidedAnswerNode.push({
        BODY: '<p>SAP Fiori Tools is a set of extensions for SAP Business Application Studio and Visual Studio Code</p>',
        EDGES: [
            { LABEL: 'Deployment', TARGET_NODE: 45996, ORD: 1 },
            { LABEL: 'Fiori Generator', TARGET_NODE: 48363, ORD: 2 }
        ],
        NODE_ID: 45995,
        QUESTION: 'I have a problem with',
        TITLE: 'SAP Fiori Tools'
    });
    stateWithActiveAnswer.activeNodeSharing = {
        extensionLink: 'extension://link',
        webLink: 'web://link'
    };

    it('Should render a ShareButton component', () => {
        const { container } = render(
            <Provider store={mockStore(createState(stateWithActiveAnswer))}>
                <ShareButton />
            </Provider>
        );
        expect(container).toMatchSnapshot();

        // Test click event - Opens the callout
        const element = screen.getByTestId('callout-test-id');
        fireEvent.click(element);
        expect(screen.getByTestId('copy-btn')).toBeInTheDocument();

        // Test click event - copies the shareable link
        const copyBtn = screen.getByTestId('copy-btn');
        fireEvent.click(copyBtn);
        expect(screen.getByTestId('sharable-link-copied')).toBeInTheDocument();

        // Test link to website
        const webLink = screen.getByTestId('web-link');
        expect(webLink).toHaveAttribute('href', 'web://link');
    });
});

describe('BookmarkButton', () => {
    const initialState = {
        activeGuidedAnswer: {
            TREE_ID: 'tree1',
            TITLE: 'Tree 1'
        },
        activeGuidedAnswerNode: [{ NODE_ID: 'node1' }, { NODE_ID: 'node2' }],
        bookmarks: {}
    } as unknown as AppState;

    it('renders without crashing', () => {
        const { getByRole } = render(
            <Provider store={mockStore(createState(initialState))}>
                <BookmarkButton />
            </Provider>
        );

        expect(getByRole('button')).toBeInTheDocument();
    });

    it('adds bookmark when clicked', () => {
        const { getByRole } = render(
            <Provider store={mockStore(createState(initialState))}>
                <BookmarkButton />
            </Provider>
        );

        const button = getByRole('button');
        fireEvent.click(button);

        expect(actions.updateBookmark).toBeCalled();
    });

    it('removes bookmark when clicked', () => {
        const initialStateWithBookmark = {
            ...initialState,
            bookmarks: {
                'tree1-node1:node2': {
                    tree: initialState.activeGuidedAnswer,
                    nodePath: initialState.activeGuidedAnswerNode
                }
            }
        } as unknown as AppState;

        const { getByRole } = render(
            <Provider store={mockStore(createState(initialStateWithBookmark))}>
                <BookmarkButton />
            </Provider>
        );

        const button = getByRole('button');
        fireEvent.click(button);
        expect(actions.updateBookmark).toBeCalled();
    });
});
