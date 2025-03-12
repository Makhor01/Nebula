import React, { useEffect, useState } from "react";
import { Calendar, Modal, Form, Input, Button, List } from "antd";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import dayjs from "dayjs";
import { getToken } from "../utils/auth";

const CalendarPage = () => {
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false); // Флаг для редактирования
    const [currentEvent, setCurrentEvent] = useState(null); // Текущее событие
    const [selectedDate, setSelectedDate] = useState(dayjs()); // Выбранная дата
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`http://185.91.52.121:4000/api/calendar`, {
                    headers: { Authorization: `Bearer ${getToken()}` },
                });
                setEvents(response.data);
            } catch (error) {
                console.error("Failed to fetch events:", error.message);
            }
        };
        fetchEvents();

        // Регистрация Service Worker
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/service-worker.js")
                .then((registration) => {
                    console.log("Service Worker registered with scope:", registration.scope);
                })
                .catch((error) => {
                    console.error("Service Worker registration failed:", error);
                });
        }

        // Запрос разрешения на уведомления
        if ("Notification" in window) {
            Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                    console.log("Notification permission granted.");
                }
            });
        }

        // Периодическая проверка событий
        const interval = setInterval(() => {
            checkForUpcomingEvents();
        }, 5 * 60 * 1000); // Проверка каждые 5 минут

        return () => clearInterval(interval); // Очистка интервала при размонтировании
    }, []);
    const checkForUpcomingEvents = async () => {
        try {
            const response = await axios.get(`http://185.91.52.121:4000/api/calendar`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            const events = response.data;

            const now = dayjs();
            const upcomingEvents = events.filter((event) => {
                const eventTime = dayjs(event.startTime);
                return eventTime.isAfter(now) && eventTime.diff(now, "minute") <= 30; // События в ближайшие 30 минут
            });

            if (upcomingEvents.length > 0) {
                console.log("Upcoming events found:", upcomingEvents);
                upcomingEvents.forEach((event) => {
                    const notificationTitle = `Напоминание: ${event.title}`;
                    const notificationBody = `Событие начнется в ${dayjs(event.startTime).format("HH:mm")}`;

                    if ("serviceWorker" in navigator && "PushManager" in window) {
                        navigator.serviceWorker.ready.then((registration) => {
                            console.log("Sending notification:", notificationTitle, notificationBody);
                            registration.showNotification(notificationTitle, {
                                body: notificationBody,
                            });
                        });
                    }
                });
            } else {
                console.log("No upcoming events found.");
            }
        } catch (error) {
            console.error("Failed to fetch events for notifications:", error.message);
        }
    };
    const sendTestNotification = async () => {
        if ("serviceWorker" in navigator && "PushManager" in window) {
            try {
                const registration = await navigator.serviceWorker.ready;
                console.log("Service Worker is ready:", registration);
                await registration.showNotification("Test Notification", {
                    body: "This is a test notification.",
                });
                console.log("Test notification sent successfully!");
            } catch (error) {
                console.error("Failed to send test notification:", error);
            }
        } else {
            console.error("Service Worker or Push API is not supported in this browser.");
        }
    };

// Вызовите эту функцию для тестирования
    sendTestNotification();

    const onFinish = async (values) => {
        try {
            const formattedValues = {
                ...values,
                startTime: dayjs(values.startTime).toISOString(),
                endTime: dayjs(values.endTime).toISOString(),
                priority: "low", // Устанавливаем низкий приоритет
                status: "todo", // Устанавливаем статус "todo"
            };

            if (isEdit) {
                const response = await axios.put(
                    `http://185.91.52.121:4000/api/calendar/${currentEvent.id}`,
                    formattedValues,
                    { headers: { Authorization: `Bearer ${getToken()}` } }
                );
                setEvents(events.map((event) => (event.id === response.data.id ? response.data : event)));
            } else {
                // Создание нового события
                const response = await axios.post(
                    `http://185.91.52.121:4000/api/calendar`,
                    formattedValues,
                    { headers: { Authorization: `Bearer ${getToken()}` } }
                );
                setEvents([...events, response.data]);
            }

            form.resetFields();
            closeModal();
        } catch (error) {
            console.error("Failed to save event:", error.message);
        }
    };

    const handleEdit = (event) => {
        setCurrentEvent(event);
        form.setFieldsValue({
            title: event.title,
            description: event.description,
            startTime: dayjs(event.startTime).format("YYYY-MM-DDTHH:mm"),
            endTime: dayjs(event.endTime).format("YYYY-MM-DDTHH:mm"),
        });
        setIsEdit(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (eventId) => {
        try {
            await axios.delete(`http://185.91.52.121:4000/api/calendar/${eventId}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setEvents(events.filter((event) => event.id !== eventId));
            closeModal();
        } catch (error) {
            console.error("Failed to delete event:", error.message);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEdit(false);
        setCurrentEvent(null); // Сбрасываем текущее событие
        form.resetFields(); // Сбрасываем форму
    };

    const dateCellRender = (date) => {
        const dayEvents = events.filter((event) =>
            dayjs(event.startTime).isSame(date, "day")
        );
        return (
            <ul>
                {dayEvents.map((event) => (
                    <li key={event.id} onClick={() => handleEdit(event)}>
                        {event.title}
                    </li>
                ))}
            </ul>
        );
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const filteredEvents = events.filter((event) =>
        dayjs(event.startTime).isSame(selectedDate, "day")
    );

    return (
        <div style={{ display: "flex" }}>
            <Sidebar />
            <div style={{ marginLeft: 260, padding: 20 }}>
                <Button type="primary" onClick={() => setIsModalOpen(true)}>
                    Add Event
                </Button>
                <Calendar
                    dateCellRender={dateCellRender}
                    onSelect={handleDateChange} // Обработчик изменения даты
                />
                <List
                    header={`Events for ${selectedDate.format("YYYY-MM-DD")}`}
                    dataSource={filteredEvents}
                    locale={{ emptyText: "В этот день дел нет!" }} // Пустое сообщение
                    renderItem={(event) => (
                        <List.Item
                            actions={[
                                <Button onClick={() => handleEdit(event)}>Edit</Button>,
                                <Button danger onClick={() => handleDelete(event.id)}>
                                    Delete
                                </Button>,
                            ]}
                        >
                            {event.title} - {event.description || "No Description"}
                        </List.Item>
                    )}
                />
                <Modal
                    title={isEdit ? "Edit Event" : "Add Event"}
                    open={isModalOpen}
                    onCancel={closeModal}
                    footer={null}
                >
                    <Form form={form} onFinish={onFinish} layout="vertical">
                        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                            <Input id="title" /> {/* Добавлен id */}
                        </Form.Item>
                        <Form.Item name="description" label="Description">
                            <Input id="description" /> {/* Добавлен id */}
                        </Form.Item>
                        <Form.Item
                            name="startTime"
                            label="Start Time"
                            rules={[{ required: true }]}
                        >
                            <Input type="datetime-local" id="startTime" /> {/* Добавлен id */}
                        </Form.Item>
                        <Form.Item
                            name="endTime"
                            label="End Time"
                            rules={[{ required: true }]}
                        >
                            <Input type="datetime-local" id="endTime" /> {/* Добавлен id */}
                        </Form.Item>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            {isEdit && (
                                <Button danger onClick={() => handleDelete(currentEvent.id)}>
                                    Delete Event
                                </Button>
                            )}
                            <Button type="primary" htmlType="submit" id="saveButton"> {/* Добавлен id */}
                                Save
                            </Button>
                        </div>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};
export default CalendarPage;
