import React from 'react';
import { shallow } from 'enzyme';
import { App } from '../src/webview/ui/components/App';
import { initI18n } from '../src/webview/i18n';

jest.mock('@vscode/webview-ui-toolkit/react', () => ({
    VSCodeTextField: () => (
        <>
            <div>SearchField</div>
        </>
    )
}));

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest
        .fn()
        .mockReturnValue({ activeGuidedAnswerNode: [{ a: 0 }, { b: 0 }] })
        .mockReturnValueOnce({
            activeGuidedAnswerNode: [],
            guidedAnswerTrees: [],
            query: '',
            searchResultCount: 0
        })
        .mockReturnValueOnce({
            activeGuidedAnswerNode: [],
            guidedAnswerTrees: [
                {
                    AVAILABILITY: 'PUBLIC',
                    DESCRIPTION: 'This is a troubleshooting guide to solve the issues while using SAP Fiori tools',
                    FIRST_NODE_ID: 45995,
                    TITLE: 'SAP Fiori tools',
                    TREE_ID: 3046
                }
            ],
            query: 'fiori tools',
            searchResultCount: 1
        })
}));

describe('<NoAnswersFound />', () => {
    let wrapper: any;
    initI18n();
    beforeEach(() => {
        wrapper = shallow(<App />);
    });

    afterEach(() => {
        jest.clearAllMocks();
        wrapper.unmount();
    });

    it('Should render a App component - No Answers', () => {
        expect(wrapper.find('.guided-answer').length).toBe(1);
        expect(wrapper.find('Header').length).toBe(1);
        expect(wrapper.find('.guided-answer__container').length).toBe(1);
        expect(wrapper.find('NoAnswersFound').length).toBe(1);
    });

    it('Should render a App component with result', () => {
        expect(wrapper.find('.guided-answer').length).toBe(1);
        expect(wrapper.find('Header').length).toBe(1);
        expect(wrapper.find('.guided-answer__container').length).toBe(1);
        expect(wrapper.find('.striped-list').length).toBe(1);
        expect(wrapper.find('.tree-item').length).toBe(1);
        expect(wrapper.find('.guided-answer__tree__title').length).toBe(1);
        expect(wrapper.find('.guided-answer__tree__ul').length).toBe(1);
        expect(wrapper.find('.guided-answer__tree__desc').text()).toBe(
            'This is a troubleshooting guide to solve the issues while using SAP Fiori tools'
        );
    });

    it('Should render a App component with GuidedAnswerNode component', () => {
        expect(wrapper.find('.guided-answer').length).toBe(1);
        expect(wrapper.find('Header').length).toBe(1);
        expect(wrapper.find('.guided-answer__container').length).toBe(1);
        expect(wrapper.find('GuidedAnswerNode').length).toBe(1);
    });
});
