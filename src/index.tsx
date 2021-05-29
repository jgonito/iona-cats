import React from 'react';
import ReactDOM from 'react-dom';
import { ContextProvider } from './context';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
    <React.StrictMode>
        <ContextProvider>
            <App />
        </ContextProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
