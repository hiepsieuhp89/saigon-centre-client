import {
  createRecharge,
  ICreateRecharge,
  ISearchHistory,
  withdraw,
} from "./../api/services/transaction.service";
// product.hooks.ts

import {
  useMutation,
  UseMutationResult,
  useQuery,
} from "@tanstack/react-query";
import { IProductListResponse } from "@/api/services/product.service";
import { getHistory } from "@/api/services/transaction.service";

export const useGetTransactionHistory = (): UseMutationResult<{data: any}, Error, ISearchHistory> => {
  return useMutation<any, Error, ISearchHistory>({
    mutationFn: (params: ISearchHistory) => getHistory(params),
    onSuccess: (result: {data: any}) => {
      return result?.data;
    },
    onError: (result: any) => {
      return result;
    },
  });
};



export const useCreateRecharge = (): UseMutationResult<
  ICreateRecharge,
  Error,
  any
> => {
  return useMutation<ICreateRecharge, Error, any>({
    mutationFn: (params: ICreateRecharge) => createRecharge(params),
  });
};

export const useWithdraw = (): UseMutationResult<
  any,
  Error,
  any
> => {
  return useMutation<any, Error, any>({
    mutationFn: (params: any) => withdraw(params),
  });
};
