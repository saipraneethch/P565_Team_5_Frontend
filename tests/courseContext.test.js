import { coursesReducer } from '../src/context/courseContext';

describe('coursesReducer', () => {
  test('should return the initial state for unknown action types', () => {
    const initialState = { courses: [] };
    const action = { type: 'UNKNOWN' };
    const state = coursesReducer(initialState, action);
    expect(state).toEqual(initialState);
  });

  test('should set the courses for SET_COURSES action', () => {
    const initialState = { courses: [] };
    const newCourses = [{ id: 1, name: 'Course 1' }, { id: 2, name: 'Course 2' }];
    const action = { type: 'SET_COURSES', payload: newCourses };
    const state = coursesReducer(initialState, action);
    expect(state).toEqual({ courses: newCourses });
  });

  test('should add a course for CREATE_COURSE action', () => {
    const initialState = { courses: [{ id: 1, name: 'Course 1' }] };
    const newCourse = { id: 2, name: 'Course 2' };
    const action = { type: 'CREATE_COURSE', payload: newCourse };
    const state = coursesReducer(initialState, action);
    expect(state.courses.length).toBe(2);
    expect(state.courses).toContain(newCourse);
  });

  test('should delete a course for DELETE_COURSE action', () => {
    const initialState = { courses: [{ _id: 1, name: 'Course 1' }, { _id: 2, name: 'Course 2' }] };
    expect(initialState.courses.length).toBe(2);
    const action = { type: 'DELETE_COURSE', payload: 2 }; 
    const state = coursesReducer(initialState, action);
    expect(state.courses.length).toBe(1);
    expect(state.courses).not.toContainEqual({ _id: 2, name: 'Course 2' });
  });

  test('should update a course for UPDATE_COURSE action', () => {
    const initialState = { courses: [{ id: 1, name: 'Course 1' }, { id: 2, name: 'Course 2' }] };
    const updatedCourse = { id: 1, name: 'Updated Course 1' };
    const action = { type: 'UPDATE_COURSE', payload: updatedCourse };
    const state = coursesReducer(initialState, action);
    expect(state.courses.length).toBe(2);
    expect(state.courses).toContainEqual(updatedCourse);
    expect(state.courses).not.toContainEqual({ id: 1, name: 'Course 1' });
  });
});
