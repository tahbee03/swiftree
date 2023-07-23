import "bootstrap/dist/css/bootstrap.css"; // Bootstrap CSS
import './index.css'; // Global styles (must be after Bootstrap to override)

import App from './App'; // <App />
import AuthContextProvider from './components/AuthContextProvider'; // <AuthContextProvider>
import { ErrorContextProvider } from './contexts/ErrorContext'; // <ErrorContextProvider>

import ReactDOM from 'react-dom/client'; // ReactDOM.createRoot()

ReactDOM.createRoot(document.getElementById('root')).render(
    <ErrorContextProvider>
        <AuthContextProvider>
            <App />
        </AuthContextProvider>
    </ErrorContextProvider>
);
