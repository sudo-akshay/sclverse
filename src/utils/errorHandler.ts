// src/utils/errorHandler.ts
export const handleApiError = (error: any): string => {
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      return error.response.data.message || 'An error occurred on the server.';
    }
    if (error.request) {
      // Request was made, but no response received
      return 'No response from server. Please check your internet connection.';
    }
    // Other unexpected errors
    return 'An unexpected error occurred. Please try again.';
  };
  