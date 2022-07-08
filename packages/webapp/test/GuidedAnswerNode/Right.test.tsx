import React from 'react';
import { shallow } from 'enzyme';
import { Right } from '../../src/webview/ui/components/GuidedAnswerNode/Right';
import { actions } from '../../src/webview/state';
import { initI18n } from '../../src/webview/i18n';
import { activeGuidedAnswerNodeMock } from '../__mocks__/mocks';

jest.mock('../../src/webview/state', () => {
    return {
        actions: {
            executeCommand: jest.fn()
        }
    };
});

describe('<Right />', () => {
    let wrapper: any;
    initI18n();

    afterEach(() => {
        jest.clearAllMocks();
        wrapper.unmount();
    });

    it('Should render a Right component without command', () => {
        wrapper = shallow(<Right activeNode={activeGuidedAnswerNodeMock[0]} />);
        const component = wrapper.html();
        expect(component).toMatchInlineSnapshot(
            `"<div id=\\"right\\" class=\\"column\\"><div class=\\"guided-answer__node__commands\\"></div></div>"`
        );
    });

    it('Should render a Right component', () => {
        const activeNodeMock: any = activeGuidedAnswerNodeMock[0];
        activeNodeMock.COMMANDS = [
            {
                label: 'Label for command',
                description: 'Description for command',
                exec: {
                    extensionId: 'terry.exxt',
                    commandId: 'Knock kock',
                    argument: { fsPath: 'whos/there/body/of' }
                }
            }
        ];
        wrapper = shallow(<Right activeNode={activeNodeMock} />);
        const component = wrapper.html();
        expect(component).toMatchInlineSnapshot(
            `"<div id=\\"right\\" class=\\"column\\"><div class=\\"guided-answer__node__commands\\"><div class=\\"guided-answer__node__command\\"><div class=\\"guided-answer__node__command__header\\"><div class=\\"guided-answer__node__command__header__label\\">Label for command</div></div><div class=\\"guided-answer__node__command__description\\">Description for command</div></div></div></div>"`
        );

        //Test click event
        wrapper.find('.guided-answer__node__command__description').simulate('click');
        expect(actions.executeCommand).toBeCalled();
    });
});
