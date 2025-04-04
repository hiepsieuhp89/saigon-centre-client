import { sendPut } from "./../apiClient";
// auth.service.ts

import { sendGet, sendPost, sendPatch } from "../apiClient";
import { ConfigAuthEndPoint, ConfigSpinEndPoint } from "./contants";

export interface ISignIn {
  phone: string;
  password: string;
}

export interface ILogin {
  username: string;
  password: string;
  gate: string;
}

export interface FormDataLogin {
  fullName: string;
  username: string;
  password: string;
  withdrawPassword?: string;
  phone: string;
  invitationCode?: string;
  gate: string;
}

export interface FormUpdateBank {
  bankNumber: string;
  bankCode: string;
}

export interface IAuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
}

export interface IUserProfile {
  id: string;
  username: string;
  email: string | null;
  phone: string;
  fullName: string;
  role: string;
  vipLevel: number;
  vipPoint: number;
  gate: string;
  referralCode: string;
  bankName: string | null;
  bankNumber: string | null;
  bankCode: string | null;
  createdAt: string;
  updatedAt: string;
  address?: string;
  city?: string;
  district?: string;
  ward?: string;
}

export interface IBank {
  id: string;
  bankName: string;
  bankCode: string;
  logoUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISpinProduct {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

export interface ISpinResult {
  success: boolean;
  message: string;
  data: {
    product: ISpinProduct;
    profit: number;
    newBalance: number;
    totalSpins: number;
    isFrozen: boolean;
    vipLevelUpgrade: boolean;
  };
}

export interface ISpinConfig {
  id: string;
  userId: string;
  totalSpins: number;
  winningSpinNumber: number;
  productId: string;
  isActive: boolean;
  product?: ISpinProduct;
}

export interface IUpdateSpinConfig {
  winningSpinNumber?: number;
  productId?: string;
  isActive?: boolean;
}

export interface ISpinHistoryItem {
  id: string;
  userId: string;
  productId: string;
  productPrice: string;
  profit: string;
  balanceBefore: string;
  balanceAfter: string;
  vipLevel: number;
  isFrozen: boolean;
  isSuccess: boolean;
  createdAt: string;
  product: {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    description: string;
    price: string;
    stock: number;
    imageUrl: string;
    gate: string;
    categoryId: string;
    storeId: string;
    isFrozen: boolean;
  };
}

export interface ISpinHistoryResponse {
  data: ISpinHistoryItem[];
  meta: {
    page: number;
    take: number;
    itemCount: number;
    pageCount: number;
  };
}

export const signIn = async (
  payload: ILogin
): Promise<{ data: IAuthResponse }> => {
  const res = await sendPost(ConfigAuthEndPoint.LOGIN, payload);
  return res;
};

export const getProfile = async (): Promise<{ data: IUserProfile }> => {
  const res = await sendGet(ConfigAuthEndPoint.PROFILE);
  return res;
};

export const register = async (
  payload: FormDataLogin
): Promise<{ data: IAuthResponse }> => {
  const res = await sendPost(ConfigAuthEndPoint.REGISTER, payload);
  return res;
};

export const updateBankUser = async (
  payload: FormUpdateBank
): Promise<{ data: any }> => {
  const res = await sendPut(ConfigAuthEndPoint.UPDATE_BANK_USER, payload);
  return res;
};

export const getListBank = async (): Promise<IBank[]> => {
  const res = await sendGet(ConfigAuthEndPoint.GET_LIST_BANK);
  return res?.data;
};

export const updateInfoUser = async (payload: any): Promise<{ data: any }> => {
  const res = await sendPut(ConfigAuthEndPoint.UPDATE_USER, payload);
  return res;
};

export const getTransaction = async (): Promise<any> => {
  const res = await sendGet(ConfigAuthEndPoint.GET_TRANSACTION);
  return res?.data;
};

interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export const changePassword = async (
  payload: ChangePasswordPayload
): Promise<{ data: any }> => {
  const res = await sendPut(ConfigAuthEndPoint.CHANGE_PASSWORD, payload);
  return res;
};

export const getAvailableSpinProducts = async (): Promise<{
  data: ISpinProduct[];
}> => {
  const res = await sendGet(ConfigSpinEndPoint.GET_AVAILABLE_PRODUCTS);
  return res;
};

export const spinProduct = async (): Promise<{ data: ISpinResult }> => {
  const res = await sendPost(ConfigSpinEndPoint.SPIN_PRODUCT, {});
  return res;
};

export const getSpinConfig = async (
  userId: string
): Promise<{ data: ISpinConfig }> => {
  const res = await sendGet(ConfigSpinEndPoint.GET_SPIN_CONFIG(userId));
  return res;
};

export const updateSpinConfig = async (
  userId: string,
  payload: IUpdateSpinConfig
): Promise<{ data: ISpinConfig }> => {
  const res = await sendPatch(
    ConfigSpinEndPoint.UPDATE_SPIN_CONFIG(userId),
    payload
  );
  return res;
};

export const confirmSpin = async (): Promise<{ data: any }> => {
  const res = await sendPost(ConfigSpinEndPoint.CONFIRM_SPIN, {});
  return res;
};

export const getSpinHistory = async (params: {
  page: number;
  take: number;
  order?: "ASC" | "DESC";
}): Promise<ISpinHistoryResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append("page", params.page.toString());
  queryParams.append("take", params.take.toString());
  if (params.order) {
    queryParams.append("order", params.order);
  }

  const url = `${
    ConfigSpinEndPoint.GET_SPIN_HISTORY
  }?${queryParams.toString()}`;
  const res = await sendGet(url);
  return res.data;
};
