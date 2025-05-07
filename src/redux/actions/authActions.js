// Action Types
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';

// Action Creators
export const loginSuccess = (user) => ({
  type: LOGIN_SUCCESS,
  payload: user,
});

export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error,
});

export const logout = () => ({
  type: LOGOUT,
});

// Async Actions
export const login = (credentials) => async (dispatch) => {
  try {
    // Here you would typically make an API call to your backend
    // For now, we'll simulate a successful login
    const user = {
      id: 1,
      name: 'Vivek',
      email: credentials.email,
      role: 'Employee',
    };
    
    dispatch(loginSuccess(user));
    return user;
  } catch (error) {
    dispatch(loginFailure(error.message));
    throw error;
  }
}; 