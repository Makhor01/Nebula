import React, { useState } from "react";
import { Tabs, Form, Input, Button, Card, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title } = Typography;

const AuthPage = () => {
    const [activeTab, setActiveTab] = useState("login"); // Текущая вкладка
    const navigate = useNavigate(); // Для редиректа

    const onLogin = async (values) => {
        try {
            const response = await axios.post("http://185.91.52.121:4000/api/auth/login", values);
            const expirationTime = Date.now() + 60 * 60 * 1000; // Текущий момент + 1 час
            localStorage.setItem(
                "authToken",
                JSON.stringify({ token: response.data.token, expirationTime })
            );
            navigate("/dashboard"); // Редирект на дашборд
        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong");
        }
    };

    const onRegister = async (values) => {
        try {
            console.log("Registering with values:", values);
            await axios.post("http://185.91.52.121:4000/api/auth/register", values);

            // Показываем сообщение об успешной регистрации
            alert("Registration successful! Please log in.");

            // Переключаем пользователя на вкладку "Login"
            setActiveTab("login");
        } catch (error) {
            console.error("Error during registration:", error);
            alert(error.response?.data?.message || "Something went wrong");
        }
    };

    const yandexLogin = () => {
        window.location.href = "http://185.91.52.121:4000/api/auth/yandex";
    };

    const renderLoginForm = () => (
        <Form layout="vertical" onFinish={onLogin}>
            <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Please input your email!" }]}
            >
                <Input placeholder="Enter your email" />
            </Form.Item>
            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please input your password!" }]}
            >
                <Input.Password placeholder="Enter your password" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
                Login
            </Button>
        </Form>
    );

    const renderRegisterForm = () => (
        <Form layout="vertical" onFinish={onRegister}>
            <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Please input your email!" }]}
            >
                <Input
                    placeholder="Enter your email"
                    autoComplete="username" // Добавлено
                />
            </Form.Item>
            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please input your password!" }]}
            >
                <Input.Password
                    placeholder="Enter your password"
                    autoComplete="new-password" // Добавлено
                />
            </Form.Item>
            <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                    { required: true, message: "Please confirm your password!" },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error("Passwords do not match!"));
                        },
                    }),
                ]}
            >
                <Input.Password
                    placeholder="Confirm your password"
                    autoComplete="current-password" // Добавлено
                />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
                Register
            </Button>
        </Form>
    );

    return (
        <div style={styles.container}>
            <Card style={styles.card}>
                <Title level={3}>Task Planner</Title>
                <Tabs activeKey={activeTab} onChange={setActiveTab} centered>
                    <Tabs.TabPane tab="Login" key="login">
                        {renderLoginForm()}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Register" key="register">
                        {renderRegisterForm()}
                    </Tabs.TabPane>
                </Tabs>
                <Button type="default" onClick={yandexLogin} block style={styles.yandexButton}>
                    Sign in with Yandex
                </Button>
            </Card>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
    },
    card: {
        width: 400,
        padding: 20,
        textAlign: "center",
    },
    yandexButton: {
        marginTop: 20,
        backgroundColor: "#FFCC00", // Цвет Яндекс
        color: "black",
        fontWeight: "bold",
    },
};

export default AuthPage;
