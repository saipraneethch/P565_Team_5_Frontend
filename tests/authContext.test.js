import { authReducer } from '../src/context/authContext';

describe('authReducer', () => {
    test('should return the initial state for unknown action types', () => {
        const state = { user: null };
        const action = { type: 'UNKNOWN' };
        const result = authReducer(state, action);
        expect(result).toEqual(state);
    });

    test('should update the state for LOGIN action', () => {
        const state = { user: null };
        const user = { username: 'testuser', token: 'abc123' };
        const action = { type: 'LOGIN', payload: user };
        const result = authReducer(state, action);
        expect(result).toEqual({ user: user });
    });

    test('should clear the user for LOGOUT action', () => {
        const state = { user: { username: 'testuser', token: 'abc123' } };
        const action = { type: 'LOGOUT' };
        const result = authReducer(state, action);
        expect(result).toEqual({ user: null });
    });
});
