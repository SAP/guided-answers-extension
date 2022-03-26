import * as actions from '../src/actions';

test('All action factories produce action data', () => {
    const actionFactories: { [key: string]: () => any } = actions as unknown as { [key: string]: () => any };
    for (const af in actionFactories) {
        if (typeof af === 'string' && typeof actionFactories[af] === 'function') {
            const result = actionFactories[af]();
            expect(typeof result).toBe('object');
        }
    }
});
