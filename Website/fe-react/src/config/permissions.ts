export const ALL_PERMISSIONS = {
    TYPES: {
        GET_PAGINATE: { method: "GET", path: '/api/v1/types', module: "TYPES" },
        CREATE: { method: "POST", path: '/api/v1/types', module: "TYPES" },
        UPDATE: { method: "PATCH", path: '/api/v1/types/:id', module: "TYPES" },
        DELETE: { method: "DELETE", path: '/api/v1/types/:id', module: "TYPES" },
    },
    PRODUCTS: {
        GET_PAGINATE: { method: "GET", path: '/api/v1/products', module: "PRODUCTS" },
        CREATE: { method: "POST", path: '/api/v1/products', module: "PRODUCTS" },
        UPDATE: { method: "PATCH", path: '/api/v1/products/:id', module: "PRODUCTS" },
        DELETE: { method: "DELETE", path: '/api/v1/products/:id', module: "PRODUCTS" },
    },
    PERMISSIONS: {
        GET_PAGINATE: { method: "GET", path: '/api/v1/permissions', module: "PERMISSIONS" },
        CREATE: { method: "POST", path: '/api/v1/permissions', module: "PERMISSIONS" },
        UPDATE: { method: "PATCH", path: '/api/v1/permissions/:id', module: "PERMISSIONS" },
        DELETE: { method: "DELETE", path: '/api/v1/permissions/:id', module: "PERMISSIONS" },
    },
    RATINGS: {
        GET_PAGINATE: { method: "GET", path: '/api/v1/ratings', module: "RATINGS" },
        CREATE: { method: "POST", path: '/api/v1/ratings', module: "RATINGS" },
        UPDATE: { method: "PATCH", path: '/api/v1/ratings/:id', module: "RATINGS" },
        DELETE: { method: "DELETE", path: '/api/v1/ratings/:id', module: "RATINGS" },
    },
    ROLES: {
        GET_PAGINATE: { method: "GET", path: '/api/v1/roles', module: "ROLES" },
        CREATE: { method: "POST", path: '/api/v1/roles', module: "ROLES" },
        UPDATE: { method: "PATCH", path: '/api/v1/roles/:id', module: "ROLES" },
        DELETE: { method: "DELETE", path: '/api/v1/roles/:id', module: "ROLES" },
    },
    USERS: {
        GET_PAGINATE: { method: "GET", path: '/api/v1/users', module: "USERS" },
        CREATE: { method: "POST", path: '/api/v1/users', module: "USERS" },
        UPDATE: { method: "PATCH", path: '/api/v1/users/:id', module: "USERS" },
        DELETE: { method: "DELETE", path: '/api/v1/users/:id', module: "USERS" },
    },
}

export const ALL_MODULES = {
    AUTH: 'AUTH',
    TYPES: 'TYPES',
    FILES: 'FILES',
    PRODUCTS: 'PRODUCTS',
    PERMISSIONS: 'PERMISSIONS',
    RATINGS: 'RATINGS',
    ROLES: 'ROLES',
    USERS: 'USERS',
    SUBSCRIBERS: 'SUBSCRIBERS'
}
