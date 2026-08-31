export const API_ENDPOINTS = {
    MENU: {
        CATEGORIES: (slug) => `/api/${slug}/menu/category`,
        ITEMS: (slug, categoryId) => `/api/${slug}/menu/search?categoryId=${categoryId}`,
        SEARCH: (slug) => `/api/${slug}/menu/search`,
        PROMOTIONS: (slug) => `/api/${slug}/promotions`,
    },
    AUTH: {
        LOGIN: (slug) => `/api/${slug}/auth/login`,
        REGISTER: (slug) => `/api/${slug}/auth/register`,
        ME: (slug) => `/api/${slug}/auth/me`,
        LOGOUT: (slug) => `/api/${slug}/auth/logout`,
        PROFILE: (slug) => `/api/${slug}/auth/profile`,
    },
};
