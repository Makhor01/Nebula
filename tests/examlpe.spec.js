const { test, expect } = require('@playwright/test');

test.describe('Auth Page Tests', () => {
    test.beforeEach(async ({page}) => {
        // Переход на страницу авторизации перед каждым тестом
        await page.goto('http://185.91.52.121:80'); // Укажите URL вашего приложения
        await page.waitForLoadState('networkidle');
    });

    test('should login successfully', async ({page}) => {
        // Переход на вкладку "Login"
        await page.click('text=Login');

        // Заполнение формы логина
        await page.fill('input[placeholder="Enter your email"]', '777');
        await page.fill('input[placeholder="Enter your password"]', '1');

        // Нажатие кнопки "Login"
        await page.click('button:has-text("Login")');

        // Проверка редиректа на страницу dashboard
        await page.waitForURL('**/dashboard');
        expect(page.url()).toContain('/dashboard');
    });

    // test('should create a new event in the calendar', async ({ page }) => {
    //     test.setTimeout(60000); // Увеличиваем таймаут для теста
    //
    //
    //     // Переход на вкладку "Login"
    //     await page.click('text=Login');
    //
    //     // Заполнение формы логина
    //     await page.fill('input[placeholder="Enter your email"]', '777');
    //     await page.fill('input[placeholder="Enter your password"]', '1');
    //
    //     // Нажатие кнопки "Login"
    //     await page.click('button:has-text("Login")');
    //
    //     // Проверка редиректа на страницу dashboard
    //     await page.waitForURL('**/dashboard');
    //
    //     // Шаг 2: Переход в календарь через сайдбар
    //     await page.click('text=Calendar');
    //     await page.waitForURL('**/calendar');
    //
    //     // Шаг 3: Создание новой задачи в календаре
    //     await page.click('button:has-text("Add Event")');
    //     await page.waitForSelector('.ant-modal-title:has-text("Add Event")');
    //
    //     // Заполнение формы создания события
    //     await page.fill('#title', 'Test Event'); // Используем id
    //     await page.fill('#description', 'This is a test event'); // Используем id
    //
    //     // Заполнение поля "начальное время"
    //     await page.fill('#startTime', '2023-10-15T10:00'); // Используем id
    //
    //     // Заполнение поля "конечное время"
    //     await page.fill('#endTime', '2023-10-15T11:00'); // Используем id
    //
    //     // Нажатие кнопки "Save"
    //     await page.click('#saveButton'); // Используем id
    //
    //     // Ожидание закрытия модального окна
    //     await page.waitForSelector('.ant-modal', { state: 'hidden' });
    //
    //     // Проверка, что событие появилось в календаре
    //     const eventTitle = await page.textContent('text=Test Event');
    //     expect(eventTitle).toBe('Test Event');
    // });
});