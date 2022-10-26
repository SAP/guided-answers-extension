import React from 'react';
import { shallow } from 'enzyme';
import { FiltersRibbon } from '../../src/webview/ui/components/Header/Filters/FiltersRibbon';
import { actions } from '../../src/webview/state';

let state = {
    query: 'Fiori tools',
    selectedProductFilters: ['ProductFilter1, ProductFilter2'],
    selectedComponentFilters: ['ComponentFilter1', 'ComponentFilter2']
};

jest.mock('../../src/webview/state', () => {
    return {
        actions: {
            resetFilters: jest.fn(),
            searchTree: jest.fn()
        }
    };
});

jest.mock('react-redux', () => {
    const lib = jest.requireActual('react-redux');

    return {
        ...lib,
        useSelector: () => state
    };
});

describe('<FiltersRibbon />', () => {
    let wrapper: any;
    beforeEach(() => {
        wrapper = shallow(<FiltersRibbon />);
    });

    afterEach(() => {
        jest.clearAllMocks();
        wrapper.unmount();
    });

    it('Should render a FiltersRibbon component', () => {
        const component = wrapper.html();
        expect(component).toMatchInlineSnapshot(
            `"<div style="line-height:18px">Searching in Product<strong> </strong><strong>ProductFilter1, ProductFilter2</strong><span>  and  </span>Component <strong>ProductFilter1, ProductFilter2</strong><strong> </strong><button class="clear-filters" title="Clear filters"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" class="clear-filters__content" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 8.707l3.646 3.647.708-.707L8.707 8l3.647-3.646-.707-.708L8 7.293 4.354 3.646l-.707.708L7.293 8l-3.646 3.646.707.708L8 8.707z"></path></svg> <span class="clear-filters__content__text text-underline">Clear filters</span></button></div>"`
        );

        wrapper.find('.clear-filters').simulate('click');
        expect(actions.resetFilters).toBeCalled();
        expect(actions.searchTree).toHaveBeenCalledWith({
            query: state.query,
            filters: {
                product: [],
                component: []
            },
            paging: {
                offset: 0,
                responseSize: undefined
            }
        });

        expect(actions.resetFilters).toHaveBeenCalledTimes(1);
        expect(actions.searchTree).toHaveBeenCalledTimes(1);
    });
});
