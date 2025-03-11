self.addEventListener("install", (event) => {
    console.log("Service Worker installing.");
    self.skipWaiting(); // Активировать Service Worker сразу после установки
});

self.addEventListener("activate", (event) => {
    console.log("Service Worker activating.");
});

self.addEventListener("push", (event) => {
    console.log("Push event received:", event);

    if (!event.data) {
        console.error("No data in push event");
        return;
    }

    try {
        const data = event.data.json();
        console.log("Push data:", data);

        const { title, body } = data;

        const options = {
            body: body,
        };

        event.waitUntil(
            self.registration.showNotification(title, options)
        );
    } catch (error) {
        console.error("Failed to process push event:", error);
    }
});w

self.addEventListener("message", (event) => {
    const { title, body } = event.data;

    const options = {
        body: body, // Только текст
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});
