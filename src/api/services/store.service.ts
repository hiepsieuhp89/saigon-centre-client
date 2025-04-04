// store.service.ts

import { sendGet, sendPost, sendPatch, sendDelete } from "../apiClient";
import { ConfigStoreEndPoint } from "./contants";

export interface IStore {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  logo: string;
  isActive: boolean;
  openingHours: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateStore {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  logo: string;
  openingHours: string;
}

export interface IUpdateStore {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  logo?: string;
  isActive?: boolean;
  openingHours?: string;
}

export interface IStoreListResponse {
  data: IStore[];
  meta: {
    page: number;
    take: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export const createStore = async (payload: ICreateStore): Promise<IStore> => {
  const res = await sendPost(ConfigStoreEndPoint.CREATE, payload);
  return res;
};

export const getStores = async (page: number = 1, take: number = 10): Promise<IStoreListResponse> => {
  const res = await sendGet(`${ConfigStoreEndPoint.GET_LIST}?page=${page}&take=${take}`);
  return res;
};

export const getActiveStores = async (): Promise<IStore[]> => {
  const res = await sendGet(ConfigStoreEndPoint.GET_ACTIVE);
  return res;
};

export const getStoreDetail = async (id: string): Promise<IStore> => {
  const res = await sendGet(ConfigStoreEndPoint.GET_DETAIL(id));
  return res;
};

export const updateStore = async (id: string, payload: IUpdateStore): Promise<IStore> => {
  const res = await sendPatch(ConfigStoreEndPoint.UPDATE(id), payload);
  return res;
};

export const deleteStore = async (id: string): Promise<void> => {
  await sendDelete(ConfigStoreEndPoint.DELETE(id));
};