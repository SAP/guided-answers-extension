import { getGuidedAnswerApi } from '../src';

test('Smoke test API', () => {
    expect(typeof getGuidedAnswerApi === 'function').toBe(true);
});
