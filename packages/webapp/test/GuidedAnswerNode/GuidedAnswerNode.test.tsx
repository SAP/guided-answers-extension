import React from 'react';
import { HTML_ENHANCEMENT_DATA_ATTR_MARKER } from '@sap/guided-answers-extension-types';
import { GuidedAnswerNode } from '../../src/webview/ui/components/GuidedAnswerNode';
import { initI18n } from '../../src/webview/i18n';
import { render, cleanup } from '@testing-library/react';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest
        .fn()
        .mockReturnValue({ activeGuidedAnswerNode: [] })
        .mockReturnValueOnce([
            {
                BODY: `<p>SAP Fiori Tools is a set of extensions for SAP Business Application Studio and Visual Studio Code <span ${HTML_ENHANCEMENT_DATA_ATTR_MARKER}="%7B%22label%22%3A%22Archive%20Project%22%2C%22description%22%3A%22Run%20command%20to%20archive%20a%20Fiori%20tools%20project%20from%20current%20workspace%22%2C%22exec%22%3A%7B%22extensionId%22%3A%22sapse.sap-ux-application-modeler-extension%22%2C%22commandId%22%3A%22sap.ux.environmentcheck.archiveProject%22%7D%7D">Fiori: Archive Project</span></p>`,
                EDGES: [
                    { LABEL: 'Deployment', TARGET_NODE: 45996, ORD: 1 },
                    { LABEL: 'Fiori Generator', TARGET_NODE: 48363, ORD: 2 }
                ],
                NODE_ID: 45995,
                QUESTION: 'I have a problem with',
                TITLE: 'SAP Fiori Tools'
            }
        ])
}));

describe('<GuidedAnswerNode />', () => {
    initI18n();
    afterEach(cleanup);

    it('Should render a GuidedAnswerNode component', () => {
        const { container } = render(<GuidedAnswerNode />);
        expect(container).toMatchSnapshot();
    });

    it('Should render a GuidedAnswerNode empty component because the activeGuidedAnswerNode array is empty', () => {
        const { container } = render(<GuidedAnswerNode />);
        expect(container).toMatchSnapshot();
    });
});
