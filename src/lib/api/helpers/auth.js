export const withAuthHeaders = (req, extraHeaders = {}) => {
    const token = req.cookies.get("auth-token")?.value;

    if (!token) {
        throw { isAuthError: true, status: 401, message: "Not authenticated" };
    }

    return {
        headers: {
            Authorization: `Bearer ${token}`,
            ...extraHeaders
        }
    };
};
