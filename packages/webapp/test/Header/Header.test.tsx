import React from 'react';
import { shallow } from 'enzyme';
import { Header } from '../../src/webview/ui/components/Header';

jest.mock('@vscode/webview-ui-toolkit/react', () => ({
    VSCodeTextField: () => (
        <>
            <div>SearchField</div>
        </>
    )
}));

jest.mock('react-redux', () => {
    const lib = jest.requireActual('react-redux');
    const state = { activeGuidedAnswerNode: [{ a: 0 }, { b: 0 }] };
    return {
        ...lib,
        useSelector: () => state
    };
});

describe('<Header />', () => {
    let wrapper: any;

    afterEach(() => {
        jest.clearAllMocks();
        wrapper.unmount();
    });

    it('Should render a Header component', () => {
        wrapper = shallow(<Header showSub={true} showLogo={true} showNavButons={false} showSearch={true} />);
        expect(wrapper.find('.guided-answer__header').length).toBe(1);
        expect(wrapper.find('.guided-answer__header__sub').length).toBe(1);
        expect(wrapper.find('Logo').length).toBe(1);
        expect(wrapper.find('SearchField').length).toBe(1);

        wrapper = shallow(<Header showSub={false} showLogo={false} showNavButons={true} showSearch={false} />);
        expect(wrapper.find('.guided-answer__header__allAnswersButton').length).toBe(1);
        expect(wrapper.find('Memo(AllAnswersButton)').length).toBe(1);
        expect(wrapper.find('.guided-answer__header__back-restart-buttons').length).toBe(1);
        expect(wrapper.find('BackButton').length).toBe(1);
        expect(wrapper.find('RestartButton').length).toBe(1);
    });
});
