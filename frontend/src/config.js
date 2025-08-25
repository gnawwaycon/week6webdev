// frontend/src/config.js

const config = {
  development: {
    API_URL: 'http://localhost:5001'
  },
  production: {
    API_URL: 'https://todo-app-backend-7ka9.onrender.com'
  }
};

const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';

export const API_URL = config[environment].API_URL; 