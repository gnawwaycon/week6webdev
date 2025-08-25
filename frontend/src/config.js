// frontend/src/config.js

const config = {
  development: {
    API_URL: 'http://localhost:5001'
  },
  production: {
    API_URL: 'https://your-backend-url.herokuapp.com' // We'll update this later
  }
};

const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';

export const API_URL = config[environment].API_URL; 