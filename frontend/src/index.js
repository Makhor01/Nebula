import React from "react";
import ReactDOM, { createRoot } from "react-dom/client"; // Импорт нового метода
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from "./App";
import "antd/dist/reset.css"; // Стили Ant Design

const clientId =
    '513351924182-mmamod03p5dpc7luc7lqsokamnhedv09.apps.googleusercontent.com';

// Создаем root и рендерим приложение
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <GoogleOAuthProvider clientId={clientId}>
            <App />
    </GoogleOAuthProvider>
);