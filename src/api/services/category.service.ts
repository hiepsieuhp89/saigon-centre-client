// category.service.ts

import { sendGet, sendPost, sendPatch, sendDelete } from "../apiClient";
import { ConfigCategoryEndPoint } from "./contants";

export interface ICategory {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateCategory {
  name: string;
  description: string;
  imageUrl: string;
}

export interface IUpdateCategory {
  name?: string;
  description?: string;
  imageUrl?: string;
}

export interface ICategoryListResponse {
  data: ICategory[];
  meta: {
    page: number;
    take: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export const createCategory = async (payload: ICreateCategory): Promise<ICategory> => {
  const res = await sendPost(ConfigCategoryEndPoint.CREATE, payload);
  return res;
};

export const getCategories = async (page: number = 1, take: number = 10): Promise<ICategoryListResponse> => {
  const res = await sendGet(`${ConfigCategoryEndPoint.GET_LIST}?page=${page}&take=${take}`);
  return res;
};

export const getCategoryDetail = async (id: string): Promise<ICategory> => {
  const res = await sendGet(ConfigCategoryEndPoint.GET_DETAIL(id));
  return res;
};

export const updateCategory = async (id: string, payload: IUpdateCategory): Promise<ICategory> => {
  const res = await sendPatch(ConfigCategoryEndPoint.UPDATE(id), payload);
  return res;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await sendDelete(ConfigCategoryEndPoint.DELETE(id));
};