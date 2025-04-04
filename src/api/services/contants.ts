const API_GATE = "AMAZON";

export const ConfigAuthEndPoint = {
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  PROFILE: "/auth/profile",
  GET_LIST_BANK: "/auth/list-bank",
  UPDATE_USER: "/auth/update-user",
  GET_TRANSACTION: "/auth/transactions",
  UPDATE_BANK_USER: "/auth/update-bank",
  CHANGE_PASSWORD: "/auth/changePassword",
};

export const ConfigProductEndPoint = {
  CREATE: "/products",
  GET_LIST: "/products",
  GET_DETAIL: (id: string) => `/products/${id}`,
  UPDATE: (id: string) => `/products/${id}`,
  DELETE: (id: string) => `/products/${id}`,
};

export const ConfigCategoryEndPoint = {
  CREATE: "/categories",
  GET_LIST: "/categories",
  GET_DETAIL: (id: string) => `/categories/${id}`,
  UPDATE: (id: string) => `/categories/${id}`,
  DELETE: (id: string) => `/categories/${id}`,
};

export const ConfigImageEndPoint = {
  UPLOAD: "/images",
  GET_LIST: "/images",
  LINK_TO_PRODUCT: (productId: string, imageId: string) => `/images/link/product/${productId}/image/${imageId}`,
  GET_PRODUCT_IMAGES: (productId: string) => `/images/product/${productId}`,
  DELETE_PRODUCT_IMAGE: (id: string) => `/images/product-image/${id}`,
  GET_DETAIL: (id: string) => `/images/${id}`,
  UPDATE: (id: string) => `/images/${id}`,
  DELETE: (id: string) => `/images/${id}`,
  GET_FILE: (filename: string) => `/images/file/${filename}`,
};

export const ConfigStoreEndPoint = {
  CREATE: "/stores",
  GET_LIST: "/stores",
  GET_ACTIVE: "/stores/active",
  GET_DETAIL: (id: string) => `/stores/${id}`,
  UPDATE: (id: string) => `/stores/${id}`,
  DELETE: (id: string) => `/stores/${id}`,
};

export const ConfigTransactionEndPoint = {
  HISTORY: "/transaction/history",
  RECHARGE: "/transaction/recharge",
  WITHDRAW: "/transaction/withdraw",
};

export const BANK_OPTIONS = [
  { value: 'vietcombank', label: 'Vietcombank' },
  { value: 'techcombank', label: 'Techcombank' },
  { value: 'bidv', label: 'BIDV' },
  { value: 'agribank', label: 'Agribank' },
  { value: 'mbbank', label: 'MB Bank' },
  { value: 'acb', label: 'ACB' },
  { value: 'vpbank', label: 'VP Bank' },
  { value: 'tpbank', label: 'TP Bank' },
  { value: 'sacombank', label: 'Sacombank' },
  { value: 'hdbank', label: 'HD Bank' }
];

// Thêm endpoints cho tính năng Spin
export const ConfigSpinEndPoint = {
  GET_AVAILABLE_PRODUCTS: "/products/spin/available",
  SPIN_PRODUCT: "/products/spin",
  GET_SPIN_CONFIG: (userId: string) => `/products/spin/config/${userId}`,
  UPDATE_SPIN_CONFIG: (userId: string) => `/products/spin/config/${userId}`,
  CONFIRM_SPIN: "/products/spin/confirm",
  GET_SPIN_HISTORY: "/users/spin/my-history",
};