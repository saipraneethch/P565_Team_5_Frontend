import { usersReducer } from '../src/context/userContext';

describe('usersReducer', () => {
  test('should handle SET_USERS action', () => {
    const initialState = { users: [] };
    const newUsers = [{ _id: 1, name: 'User 1' }, { _id: 2, name: 'User 2' }];
    const action = { type: 'SET_USERS', payload: newUsers };
    const result = usersReducer(initialState, action);
    expect(result).toEqual({ users: newUsers });
  });

  test('should handle CREATE_USER action', () => {
    const initialState = { users: [{ _id: 1, name: 'User 1' }] };
    const newUser = { _id: 2, name: 'User 2' };
    const action = { type: 'CREATE_USER', payload: newUser };
    const result = usersReducer(initialState, action);
    expect(result.users.length).toBe(2);
    expect(result.users).toContainEqual(newUser);
  });

  test('should handle DELETE_USER action', () => {
    const initialState = { users: [{ _id: 1, name: 'User 1' }, { _id: 2, name: 'User 2' }] };
    const action = { type: 'DELETE_USER', payload: { _id: 2 } };
    const result = usersReducer(initialState, action);
    expect(result.users.length).toBe(1);
    expect(result.users).not.toContainEqual({ _id: 2, name: 'User 2' });
  });

  test('should handle UPDATE_USER action', () => {
    const initialState = { users: [{ _id: 1, name: 'User 1' }, { _id: 2, name: 'User 2' }] };
    const updatedUser = { _id: 1, name: 'Updated User 1' };
    const action = { type: 'UPDATE_USER', payload: updatedUser };
    const result = usersReducer(initialState, action);
    expect(result.users.length).toBe(2);
    expect(result.users).toContainEqual(updatedUser);
    expect(result.users).not.toContainEqual({ _id: 1, name: 'User 1' });
  });
});
