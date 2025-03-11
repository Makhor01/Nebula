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
                const response = await axios.get(`http://localhost:4000/api/calendar`, {
                    headers: { Authorization: `Bearer ${getToken()}` },
                });
                setEvents(response.data);
            } catch (error) {
                console.error("Failed to fetch events:", error.message);
            }
        };
        fetchEvents();
    }, []);

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
                    `http://localhost:4000/api/calendar/${currentEvent.id}`,
                    formattedValues,
                    { headers: { Authorization: `Bearer ${getToken()}` } }
                );
                setEvents(events.map((event) => (event.id === response.data.id ? response.data : event)));
            } else {
                // Создание нового события
                const response = await axios.post(
                    `http://localhost:4000/api/calendar`,
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
            await axios.delete(`http://localhost:4000/api/calendar/${eventId}`, {
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
                            <Input />
                        </Form.Item>
                        <Form.Item name="description" label="Description">
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="startTime"
                            label="Start Time"
                            rules={[{ required: true }]}
                        >
                            <Input type="datetime-local" />
                        </Form.Item>
                        <Form.Item
                            name="endTime"
                            label="End Time"
                            rules={[{ required: true }]}
                        >
                            <Input type="datetime-local" />
                        </Form.Item>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            {isEdit && (
                                <Button danger onClick={() => handleDelete(currentEvent.id)}>
                                    Delete Event
                                </Button>
                            )}
                            <Button type="primary" htmlType="submit">
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