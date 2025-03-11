import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles.css";
import { Button, Modal, Form, Input, Select, message } from "antd";
import { getToken } from "../utils/auth";

const KanbanPage = () => {
    const [columns, setColumns] = useState({
        todo: [],
        inProgress: [],
        done: [],
    });
    const [isModalOpen, setIsModalOpen] = useState(false); // Для добавления задачи
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false); // Для просмотра задачи
    const [currentTask, setCurrentTask] = useState(null); // Текущая задача для перетаскивания
    const [selectedTask, setSelectedTask] = useState(null); // Выбранная задача для просмотра
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get("http://185.91.52.121:4000/api/calendar", {
                    headers: { Authorization: `Bearer ${getToken()}` },
                });
                const tasks = response.data;

                const groupedTasks = {
                    todo: tasks.filter((task) => task.status === "todo").sort((a, b) => a.priority.localeCompare(b.priority)),
                    inProgress: tasks.filter((task) => task.status === "inProgress").sort((a, b) => a.priority.localeCompare(b.priority)),
                    done: tasks.filter((task) => task.status === "done").sort((a, b) => a.priority.localeCompare(b.priority)),
                };

                setColumns(groupedTasks);
            } catch (error) {
                console.error("Failed to fetch tasks:", error.message);
            }
        };

        fetchTasks();
    }, []);

    const handleDragStart = (columnId, taskIndex) => {
        setCurrentTask({ columnId, taskIndex });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = async (targetColumnId) => {
        if (!currentTask) return;

        const { columnId, taskIndex } = currentTask;
        const sourceColumn = [...columns[columnId]];
        const task = sourceColumn.splice(taskIndex, 1)[0];
        task.status = targetColumnId; // Обновляем статус задачи

        const targetColumn = [...columns[targetColumnId]];
        targetColumn.push(task);

        setColumns((prev) => ({
            ...prev,
            [columnId]: sourceColumn,
            [targetColumnId]: targetColumn,
        }));

        try {
            // Отправляем всю задачу с обновленным статусом
            await axios.put(
                `http://185.91.52.121:4000/api/calendar/${task.id}`,
                task, // Отправляем всю задачу, а не только статус
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
        } catch (error) {
            console.error("Failed to update task status:", error.message);
        }

        setCurrentTask(null);
    };

    const handleAddTask = () => {
        setIsModalOpen(true);
    };

    const handleSaveTask = async (values) => {
        try {
            const response = await axios.post(
                "http://185.91.52.121:4000/api/calendar",
                values,
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            const newTask = response.data;

            setColumns((prev) => ({
                ...prev,
                [newTask.status]: [...prev[newTask.status], newTask].sort((a, b) => a.priority.localeCompare(b.priority)),
            }));

            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            console.error("Failed to add task:", error.message);
        }
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task); // Устанавливаем выбранную задачу
        setIsTaskModalOpen(true); // Открываем модальное окно
    };

    const handleDeleteTask = async () => {
        try {
            await axios.delete(`http://185.91.52.121:4000/api/calendar/${selectedTask.id}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });

            // Удаляем задачу из состояния
            setColumns((prev) => ({
                ...prev,
                [selectedTask.status]: prev[selectedTask.status].filter((task) => task.id !== selectedTask.id),
            }));

            message.success("Task deleted successfully");
            setIsTaskModalOpen(false); // Закрываем модальное окно
        } catch (error) {
            console.error("Failed to delete task:", error.message);
            message.error("Failed to delete task");
        }
    };

    return (
        <div style={{ display: "flex" }}>
            <Sidebar />
            <div style={{ marginLeft: 260, padding: 20, width: "calc(100% - 260px)" }}>
                <h1>Kanban Board</h1>
                <Button type="primary" onClick={handleAddTask}>
                    Add Task
                </Button>
                <div className="columns-container">
                    {Object.keys(columns).map((columnId) => (
                        <div
                            key={columnId}
                            className="column"
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(columnId)}
                        >
                            <h2>{columnId.replace(/([A-Z])/g, " $1")}</h2>
                            <div className="task-container">
                                {columns[columnId].map((task, index) => (
                                    <div
                                        key={task.id}
                                        className="task"
                                        draggable
                                        onDragStart={() => handleDragStart(columnId, index)}
                                        onClick={() => handleTaskClick(task)} // Обработчик клика на задачу
                                    >
                                        <div className="task-content">
                                            <strong>{task.title}</strong>
                                            <p>{task.description}</p>
                                            <p>Priority: {task.priority}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Модальное окно для добавления задачи */}
                <Modal
                    title="Add Task"
                    open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    footer={null}
                >
                    <Form form={form} onFinish={handleSaveTask} layout="vertical">
                        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="description" label="Description">
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item
                            name="priority"
                            label="Priority"
                            rules={[{ required: true, message: "Please select a priority!" }]}
                        >
                            <Select>
                                <Select.Option value="low">Low</Select.Option>
                                <Select.Option value="medium">Medium</Select.Option>
                                <Select.Option value="high">High</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="status"
                            label="Status"
                            rules={[{ required: true, message: "Please select a status!" }]}
                        >
                            <Select>
                                <Select.Option value="todo">To Do</Select.Option>
                                <Select.Option value="inProgress">In Progress</Select.Option>
                                <Select.Option value="done">Done</Select.Option>
                            </Select>
                        </Form.Item>
                        <Button type="primary" htmlType="submit">
                            Save
                        </Button>
                    </Form>
                </Modal>

                {/* Модальное окно для просмотра задачи */}
                <Modal
                    title="Task Details"
                    open={isTaskModalOpen}
                    onCancel={() => setIsTaskModalOpen(false)}
                    footer={[
                        <Button key="delete" danger onClick={handleDeleteTask}>
                            Delete Task
                        </Button>,
                        <Button key="close" onClick={() => setIsTaskModalOpen(false)}>
                            Close
                        </Button>,
                    ]}
                >
                    {selectedTask && (
                        <div>
                            <p><strong>Title:</strong> {selectedTask.title}</p>
                            <p><strong>Description:</strong> {selectedTask.description}</p>
                            <p><strong>Priority:</strong> {selectedTask.priority}</p>
                            <p><strong>Status:</strong> {selectedTask.status}</p>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
};

export default KanbanPage;
