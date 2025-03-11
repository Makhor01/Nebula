import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getToken, saveToken } from "../utils/auth";
import Sidebar from "../components/Sidebar";

const DashboardPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");

        if (token) {
            saveToken(token); // Сохраняем токен
            navigate("/dashboard", { replace: true }); // Убираем токен из строки запроса
        } else if (!getToken()) {
            alert("Session expired. Please log in again.");
            navigate("/");
        }
    }, [location, navigate]);

    return (
        <div style={{display: "flex"}}>
            <Sidebar/>
            <div style={{marginLeft: 260, padding: 20}}>
                <h1>Welcome to your Dashboard!</h1>
                {/* Здесь можно разместить виджеты или другую информацию */}
            </div>
        </div>
    );
};

export default DashboardPage;
