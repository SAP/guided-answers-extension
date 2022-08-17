import React from 'react';
import { shallow } from 'enzyme';
import { SearchField } from '../../src/webview/ui/components/Header/SearchField';
import { initI18n } from '../../src/webview/i18n';
import { actions } from '../../src/webview/state';
import i18next from 'i18next';

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

jest.mock('../../src/webview/state', () => {
    return {
        actions: {
            searchTree: jest.fn(),
            setQueryValue: jest.fn()
        }
    };
});

jest.mock('@vscode/webview-ui-toolkit/react', () => ({
    VSCodeTextField: () => (
        <>
            <div>SearchField</div>
        </>
    )
}));

jest.mock('react-redux', () => {
    const lib = jest.requireActual('react-redux');
    const state = { query: 'Fiori tools' };
    return {
        ...lib,
        useSelector: () => state
    };
});

describe('<SearchField />', () => {
    let wrapper: any;
    initI18n();
    beforeEach(() => {
        wrapper = shallow(<SearchField />);
    });

    afterEach(() => {
        jest.clearAllMocks();
        wrapper.unmount();
    });

    it('Should render a SearchField component', () => {
        expect(wrapper.find('.guided-answer__header__searchField').length).toBe(1);
        expect(wrapper.find('VSCodeTextField').length).toBe(1);
        expect(wrapper.find('VSCodeTextField').at(0).props().onInput).toBeDefined();
        expect(wrapper.find('VSCodeTextField').at(0).props().id).toBe('search-field');
        expect(wrapper.find('VSCodeTextField').at(0).props().placeholder).toBe(i18next.t('SEARCH_GUIDED_ANSWERS'));

        //Test input event
        wrapper
            .find('VSCodeTextField')
            .at(0)
            .simulate('input', { target: { value: 'Fiori Tools' } });
        expect(actions.setQueryValue).toBeCalled();
        expect(setTimeout).toHaveBeenCalledTimes(1);

        // Fast-forward until all timers have been executed
        jest.runAllTimers();

        expect(actions.searchTree).toHaveBeenCalledTimes(1);
    });
});
