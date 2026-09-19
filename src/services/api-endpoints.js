export const API_ENDPOINTS = {
    MENU: {
        GET: (slug) => `/api/${slug}/menu`,
        ITEMS: (slug, categoryId) => `/api/${slug}/menu/search?categoryId=${categoryId}`,
        PROMOTIONS: (slug) => `/api/${slug}/promotions`,
    },
    AUTH: {
        LOGIN: (slug) => `/api/${slug}/auth/login`,
        REGISTER: (slug) => `/api/${slug}/auth/register`,
        ME: (slug) => `/api/${slug}/auth/me`,
        LOGOUT: (slug) => `/api/${slug}/auth/logout`,
        PROFILE: (slug) => `/api/${slug}/auth/profile`,
    },
    INSTAGRAM: {
        POSTS: (slug) => `/api/${slug}/instagram/posts`,
    },
    PAYMENT: {
        CREATE_ORDER: (slug) => `/api/${slug}/payment/razorpay/create-order`,
        VERIFY: (slug) => `/api/${slug}/payment/razorpay/verify`,
    },
    ORDER: {
        CREATE: (slug) => `/api/${slug}/order/create`,
        GET_BY_ID: (slug, orderId) => `/api/${slug}/order/${orderId}`,
        LIST: (slug, page = 1, limit = 10) => `/api/${slug}/order?page=${page}&limit=${limit}`,
        CANCEL: (slug, orderId) => `/api/${slug}/order/${orderId}`,
    }
};
