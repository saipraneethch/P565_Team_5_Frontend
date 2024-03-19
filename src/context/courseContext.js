import { createContext, useReducer } from "react";

export const CoursesContext = createContext();

export const coursesReducer = (state, action) => {
  switch (action.type) {
    case "SET_COURSES":
      return {
        courses: action.payload,
      };
    case "CREATE_COURSE":
      return {
        courses: [action.payload, ...state.courses],
      };
    case "DELETE_COURSE":
    return {
      courses: state.courses.filter((course) => course._id !== action.payload),
    };
    case "UPDATE_COURSE":
      return {
        courses: state.courses.map((u) =>
          u._id === action.payload._id ? action.payload : u
        ),
      };

    default:
      return state;
  }
};

export const CoursesContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(coursesReducer, {
    courses: [],
  });

  return (
    <CoursesContext.Provider value={{ ...state, dispatch }}>
      {children}
    </CoursesContext.Provider>
  );
};
