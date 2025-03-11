import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <Menu mode="vertical" style={{ width: 256, height: "100vh", position: "fixed" }}>
            <Menu.Item key="dashboard">
                <Link to="/dashboard">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="calendar">
                <Link to="/calendar">Calendar</Link>
            </Menu.Item>
            <Menu.Item key="kanban">
                <Link to="/kanban">Kanban</Link>
            </Menu.Item>
        </Menu>
    );
};

export default Sidebar;
