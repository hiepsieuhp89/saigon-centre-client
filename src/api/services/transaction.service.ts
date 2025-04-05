// store.service.ts

import { sendGet, sendPost } from "../apiClient";
import { ConfigTransactionEndPoint } from "./contants";

export interface ISearchHistory {
  status: "all" | "pending" | "completed" | "rejected";
  page: number;
  limit: number;
  type: string;
}

export interface ICreateRecharge {
  money: number;
}

export interface IRechargeRequest {
  amount: number;
}

export interface IWithdrawRequest {
  amount: number;
}

export const getHistory = async (payload: ISearchHistory): Promise<any> => {
  const res = await sendGet(
    `${ConfigTransactionEndPoint.HISTORY}?status=${payload.status}&page=${
      payload.page
    }&limit=${payload.limit}${payload.type ? `&type=${payload.type}` : ""}`
  );
  return res?.data?.data;
};

export const createRecharge = async (
  payload: ICreateRecharge
): Promise<any> => {
  const res = await sendPost(ConfigTransactionEndPoint.RECHARGE, payload);
  return res;
};

export const recharge = async (payload: IRechargeRequest): Promise<void> => {
  await sendPost(ConfigTransactionEndPoint.RECHARGE, payload);
};

export const withdraw = async (payload: IWithdrawRequest): Promise<void> => {
  await sendPost(ConfigTransactionEndPoint.WITHDRAW, payload);
};
