// RefreshToken.js
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { authActions } from '../store'; // Import the Redux action

const RefreshToken = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Make a request to your server to refresh the token
    // Use an axios request or your preferred HTTP client

    // Example axios request
    axios
      .get('http://localhost:5000/api/refresh')
      .then((response) => {
        // Assuming the server returns a new access token
        const newAccessToken = response.data.accessToken;

        // Dispatch the action to update the token in your Redux store
        dispatch(authActions.setAccessToken(newAccessToken));
      })
      .catch((error) => {
        // Handle errors if token refresh fails
        console.error('Token refresh failed:', error);

        // Redirect the user to the login page or show an error message
        // You can use the `useNavigate` hook for navigation
      });
  }, [dispatch]);

  return (
    // You can render a loading spinner or message here
    <div>Loading...</div>
  );
};

export default RefreshToken;
