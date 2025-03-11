export const getToken = () => {
    const tokenData = localStorage.getItem("authToken");
    if (!tokenData) return null;

    const { token, expirationTime } = JSON.parse(tokenData);
    if (Date.now() > expirationTime) {
        localStorage.removeItem("authToken"); // Удаляем просроченный токен
        return null;
    }

    return token;
};

export const saveToken = (token) => {
    const expirationTime = Date.now() + 60 * 60 * 1000; // Текущий момент + 1 час
    localStorage.setItem("authToken", JSON.stringify({ token, expirationTime }));
};

export const removeToken = () => {
    localStorage.removeItem("authToken");
};
