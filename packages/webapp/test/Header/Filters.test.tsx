import React from 'react';
import { shallow } from 'enzyme';
import { Filters, sortProductFilters } from '../../src/webview/ui/components/Header/Filters/Filters';

jest.mock('@vscode/webview-ui-toolkit/react', () => ({
    VSCodeTextField: () => (
        <>
            <div>SearchField</div>
        </>
    )
}));

jest.mock('../../src/webview/state', () => {
    return {
        actions: {
            setProductFilters: jest.fn(),
            setComponentFilters: jest.fn(),
            searchTree: jest.fn()
        }
    };
});

jest.mock('react-redux', () => {
    const lib = jest.requireActual('react-redux');

    return {
        ...lib,
        useSelector: () => ({
            activeGuidedAnswerNode: [],
            guidedAnswerTreeSearchResult: {
                trees: [
                    {
                        AVAILABILITY: 'PUBLIC',
                        DESCRIPTION: 'This is a troubleshooting guide to solve the issues while using SAP Fiori tools',
                        FIRST_NODE_ID: 45995,
                        TITLE: 'SAP Fiori tools',
                        TREE_ID: 3046,
                        PRODUCT: 'Product A',
                        COMPONENT: 'comp-a'
                    }
                ],
                resultSize: 1,
                productFilters: [{ PRODUCT: 'Product A', COUNT: 1 }],
                componentFilters: [{ COMPONENT: 'comp-a', COUNT: 1 }]
            },
            query: 'fiori tools',
            selectedProductFilters: ['Product A'],
            selectedComponentFilters: ['comp-a']
        })
    };
});

describe('<Filters />', () => {
    let wrapper: any;
    let useEffect: any;
    const mockUseEffect = () => {
        useEffect.mockImplementationOnce((f: () => any) => f());
    };

    beforeEach(() => {
        useEffect = jest.spyOn(React, 'useEffect');

        mockUseEffect();
        wrapper = shallow(<Filters />);
    });

    afterEach(() => {
        jest.clearAllMocks();
        wrapper.unmount();
    });

    it('Should render a Filters component - Open products filter dialog', () => {
        let component = wrapper.html();
        expect(component).toMatchInlineSnapshot(
            `"<div id=\\"filters\\"><button type=\\"button\\" id=\\"filter-products\\" style=\\"margin-left:8px;background-color:var(--vscode-button-background)\\" title=\\"Filter Products\\" class=\\"ms-Button ms-Button--icon filter-button root-109\\" data-is-focusable=\\"true\\"><span class=\\"ms-Button-flexContainer flexContainer-110\\" data-automationid=\\"splitbuttonprimary\\"><i data-icon-name=\\"Table\\" aria-hidden=\\"true\\" class=\\"ms-Icon root-105 ms-Button-icon icon-112\\"></i></span></button><button type=\\"button\\" id=\\"filter-components\\" style=\\"margin-left:5px;background-color:var(--vscode-button-background)\\" title=\\"Filter Components\\" class=\\"ms-Button ms-Button--icon filter-button root-109\\" data-is-focusable=\\"true\\"><span class=\\"ms-Button-flexContainer flexContainer-110\\" data-automationid=\\"splitbuttonprimary\\"><i data-icon-name=\\"IdTag\\" aria-hidden=\\"true\\" class=\\"ms-Icon root-105 ms-Button-icon icon-112\\"></i></span></button></div>"`
        );

        wrapper.find('#filter-products').simulate('click');
        component = wrapper.html();

        expect(component).toMatchInlineSnapshot(
            `"<div id=\\"filters\\"><button type=\\"button\\" id=\\"filter-products\\" style=\\"margin-left:8px;background-color:var(--vscode-button-background)\\" title=\\"Filter Products\\" class=\\"ms-Button ms-Button--icon filter-button root-109\\" data-is-focusable=\\"true\\"><span class=\\"ms-Button-flexContainer flexContainer-110\\" data-automationid=\\"splitbuttonprimary\\"><i data-icon-name=\\"Table\\" aria-hidden=\\"true\\" class=\\"ms-Icon root-105 ms-Button-icon icon-112\\"></i></span></button><button type=\\"button\\" id=\\"filter-components\\" style=\\"margin-left:5px;background-color:var(--vscode-button-background)\\" title=\\"Filter Components\\" class=\\"ms-Button ms-Button--icon filter-button root-109\\" data-is-focusable=\\"true\\"><span class=\\"ms-Button-flexContainer flexContainer-110\\" data-automationid=\\"splitbuttonprimary\\"><i data-icon-name=\\"IdTag\\" aria-hidden=\\"true\\" class=\\"ms-Icon root-105 ms-Button-icon icon-112\\"></i></span></button><span class=\\"ms-layer\\"></span></div>"`
        );

        component = wrapper.find('UIDialog').html();
        expect(component).toMatchInlineSnapshot(`"<span class=\\"ms-layer\\"></span>"`);

        expect(
            sortProductFilters([
                { PRODUCT: 'Product B', COUNT: 1 },
                { PRODUCT: 'Product A', COUNT: 1 }
            ])
        ).toEqual([
            { PRODUCT: 'Product A', COUNT: 1 },
            { PRODUCT: 'Product B', COUNT: 1 }
        ]);
    });

    it('Should render a Filters component - Open components filter dialog', () => {
        let component = wrapper.html();
        expect(component).toMatchInlineSnapshot(
            `"<div id=\\"filters\\"><button type=\\"button\\" id=\\"filter-products\\" style=\\"margin-left:8px;background-color:var(--vscode-button-background)\\" title=\\"Filter Products\\" class=\\"ms-Button ms-Button--icon filter-button root-109\\" data-is-focusable=\\"true\\"><span class=\\"ms-Button-flexContainer flexContainer-110\\" data-automationid=\\"splitbuttonprimary\\"><i data-icon-name=\\"Table\\" aria-hidden=\\"true\\" class=\\"ms-Icon root-105 ms-Button-icon icon-112\\"></i></span></button><button type=\\"button\\" id=\\"filter-components\\" style=\\"margin-left:5px;background-color:var(--vscode-button-background)\\" title=\\"Filter Components\\" class=\\"ms-Button ms-Button--icon filter-button root-109\\" data-is-focusable=\\"true\\"><span class=\\"ms-Button-flexContainer flexContainer-110\\" data-automationid=\\"splitbuttonprimary\\"><i data-icon-name=\\"IdTag\\" aria-hidden=\\"true\\" class=\\"ms-Icon root-105 ms-Button-icon icon-112\\"></i></span></button></div>"`
        );

        wrapper.find('#filter-components').simulate('click');
        component = wrapper.html();

        expect(component).toMatchInlineSnapshot(
            `"<div id=\\"filters\\"><button type=\\"button\\" id=\\"filter-products\\" style=\\"margin-left:8px;background-color:var(--vscode-button-background)\\" title=\\"Filter Products\\" class=\\"ms-Button ms-Button--icon filter-button root-109\\" data-is-focusable=\\"true\\"><span class=\\"ms-Button-flexContainer flexContainer-110\\" data-automationid=\\"splitbuttonprimary\\"><i data-icon-name=\\"Table\\" aria-hidden=\\"true\\" class=\\"ms-Icon root-105 ms-Button-icon icon-112\\"></i></span></button><button type=\\"button\\" id=\\"filter-components\\" style=\\"margin-left:5px;background-color:var(--vscode-button-background)\\" title=\\"Filter Components\\" class=\\"ms-Button ms-Button--icon filter-button root-109\\" data-is-focusable=\\"true\\"><span class=\\"ms-Button-flexContainer flexContainer-110\\" data-automationid=\\"splitbuttonprimary\\"><i data-icon-name=\\"IdTag\\" aria-hidden=\\"true\\" class=\\"ms-Icon root-105 ms-Button-icon icon-112\\"></i></span></button><span class=\\"ms-layer\\"></span></div>"`
        );

        component = wrapper.find('UIDialog').html();
        expect(component).toMatchInlineSnapshot(`"<span class=\\"ms-layer\\"></span>"`);
    });
});
