const { findEventsByUserId, createEvent, updateEvent, deleteEvent } = require('../models/calendarEventModel');

exports.getCalendarEvents = async (req, res) => {
    try {
        const events = findEventsByUserId(req.user.userId);
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch events', error: error.message });
    }
};

exports.getKanbanEvents = async (req, res) => {
    try {
        const events = findEventsByUserId(req.user.userId);
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch events', error: error.message });
    }
};

exports.createEvent = async (req, res) => {
    try {
        const { title, description, startTime, endTime, priority, status } = req.body;
        const event = createEvent({
            title,
            description,
            startTime,
            endTime,
            priority,
            status,
            userId: req.user.userId,
        });
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create event', error: error.message });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, startTime, endTime, priority, status } = req.body;

        const updatedEvent = updateEvent(parseInt(id), {
            title,
            description,
            startTime,
            endTime,
            priority,
            status,
        });

        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update event', error: error.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const isDeleted = deleteEvent(parseInt(id));
        if (!isDeleted) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete event', error: error.message });
    }
};