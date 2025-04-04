// product.service.ts

import { sendGet, sendPost, sendPatch, sendDelete } from "../apiClient";
import { ConfigProductEndPoint, ConfigSpinEndPoint } from "./contants";

export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  stock?: number;
  imageUrls: string[] | null;
  categoryId?: string;
  storeId?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ICreateProduct {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrls: string[];
  categoryId: string;
  storeId: string;
}

export interface IUpdateProduct {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  imageUrls?: string[];
  categoryId?: string;
}

export interface IProductListResponse {
  data: IProduct[];
  meta: {
    page: number;
    take: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface IConfirmSpin {
  spinHistoryId: string;
  note: string;
}

export const createProduct = async (payload: ICreateProduct): Promise<IProduct> => {
  const res = await sendPost(ConfigProductEndPoint.CREATE, payload);
  return res;
};

export const getProducts = async (page: number = 1, take: number = 10): Promise<IProductListResponse> => {
  const res = await sendGet(`${ConfigProductEndPoint.GET_LIST}?page=${page}&take=${take}`);
  return res.data;
};

export const getProductDetail = async (id: string): Promise<IProduct> => {
  const res = await sendGet(ConfigProductEndPoint.GET_DETAIL(id));
  return res;
};

export const updateProduct = async (id: string, payload: IUpdateProduct): Promise<IProduct> => {
  const res = await sendPatch(ConfigProductEndPoint.UPDATE(id), payload);
  return res;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await sendDelete(ConfigProductEndPoint.DELETE(id));
};

export const confirmSpin = async (payload: IConfirmSpin): Promise<void> => {
  await sendPost(ConfigSpinEndPoint.CONFIRM_SPIN, payload);
};