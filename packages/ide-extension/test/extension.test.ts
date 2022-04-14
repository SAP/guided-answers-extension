import { activate } from '../src/extension';

describe('Smoke test', () => {
    test('activate is function', () => {
        expect(typeof activate === 'function').toBeTruthy();
    });
});
