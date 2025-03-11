const fs = require('fs');
const path = require('path');

const eventsFilePath = path.join(__dirname, '..', 'data', 'events.json');

const readEvents = () => {
    try {
        if (!fs.existsSync(eventsFilePath)) {
            throw new Error(`File not found: ${eventsFilePath}`);
        }
        const data = fs.readFileSync(eventsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading events file: ${error.message}`);
        throw error;
    }
};
const writeEvents = (events) => {
    fs.writeFileSync(eventsFilePath, JSON.stringify(events, null, 2));
};

const findEventsByUserId = (userId) => {
    const events = readEvents();
    return events.filter(event => event.userId === userId);
};

const createEvent = (event) => {
    const events = readEvents();
    const newEvent = {
        id: events.length + 1,
        ...event,
        createdAt: new Date().toISOString()
    };
    events.push(newEvent);
    writeEvents(events);
    return newEvent;
};

const updateEvent = (id, updatedEvent) => {
    const events = readEvents();
    const eventIndex = events.findIndex(event => event.id === id);
    if (eventIndex === -1) return null;
    events[eventIndex] = { ...events[eventIndex], ...updatedEvent };
    writeEvents(events);
    return events[eventIndex];
};

const deleteEvent = (id) => {
    const events = readEvents();
    const eventIndex = events.findIndex(event => event.id === id);
    if (eventIndex === -1) return false;
    events.splice(eventIndex, 1);
    writeEvents(events);
    return true;
};

module.exports = { findEventsByUserId, createEvent, updateEvent, deleteEvent };

