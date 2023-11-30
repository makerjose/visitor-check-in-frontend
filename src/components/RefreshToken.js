// RefreshToken.js
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { authActions } from '../store'; // Import the Redux action

const RefreshToken = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/user/refresh')
      .then((response) => {
        
        const newAccessToken = response.data.accessToken;

        // Dispatch the action to update the token in your Redux store
        dispatch(authActions.setAccessToken(newAccessToken));
      })
      .catch((error) => {
        // Handle errors if token refresh fails
        console.error('Token refresh failed:', error);

        
      });
  }, [dispatch]);

  return (
    
    <div>Loading...</div>
  );
};

export default RefreshToken;
