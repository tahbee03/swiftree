import React from 'react';
import ReactDOM from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.css"; // Import Bootstrap CSS
import App from './App';
import './index.css';
import { AuthContextProvider } from './contexts/AuthContext';
import { ErrorContextProvider } from './contexts/ErrorContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ErrorContextProvider>
        <AuthContextProvider>
            <App />
        </AuthContextProvider>
    </ErrorContextProvider>
);
