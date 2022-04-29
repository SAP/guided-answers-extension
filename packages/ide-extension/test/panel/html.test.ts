import { getHtml } from '../../src/panel/html';

describe('Test for HTML generation', () => {
    test('Generate HTML', () => {
        expect(getHtml('ROOT', 'TITLE', 'BUNDLE_URI', 'VENDOR_URI', 'VENDOR_CSS_URI')).toMatchSnapshot();
    });
});
