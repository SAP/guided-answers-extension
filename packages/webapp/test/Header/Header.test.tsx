import { treeMock } from '../__mocks__/treeMock';
import React from 'react';
import { Header } from '../../src/webview/ui/components/Header';
import { render, cleanup } from '@testing-library/react';
import { initI18n } from '../../src/webview/i18n';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { getInitialState, reducer } from '../../src/webview/state/reducers';
import { AppState } from '../../src/webview/types';

const createState = (initialState: AppState) => (actions: any[]) => actions.reduce(reducer, initialState);
const mockStore = configureMockStore();

describe('<Header />', () => {
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

    it('Should render a Header component without the navigation buttons', () => {
        const { container } = render(
            <Provider store={mockStore(createState(getInitialState()))}>
                <Header showSub={true} showLogo={true} showNavButons={false} showSearch={true} />
            </Provider>
        );
        expect(container).toMatchSnapshot();
    });

    it('Should render a Header component with the navigation buttons', () => {
        const { container } = render(
            <Provider store={mockStore(createState(stateWithActiveAnswer))}>
                <Header showSub={false} showLogo={false} showNavButons={true} showSearch={false} />
            </Provider>
        );
        expect(container).toMatchSnapshot();
    });
});
