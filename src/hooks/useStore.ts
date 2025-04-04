// store.hooks.ts

import { useMutation, UseMutationResult, useQuery } from "@tanstack/react-query";
import { createStore, getStores, getActiveStores, getStoreDetail, updateStore, deleteStore } from "@/api/services/store.service";
import { IStore, ICreateStore, IUpdateStore, IStoreListResponse } from "@/api/services/store.service";

export const useCreateStore = (): UseMutationResult<IStore, Error, ICreateStore> => {
  return useMutation<IStore, Error, ICreateStore>({
    mutationFn: (params: ICreateStore) => createStore(params),
  });
};

export const useGetStores = (page: number = 1, take: number = 10) => {
  return useQuery<IStoreListResponse, Error>({
    queryKey: ['stores', page, take],
    queryFn: () => getStores(page, take),
  });
};

export const useGetActiveStores = () => {
  return useQuery<IStore[], Error>({
    queryKey: ['activeStores'],
    queryFn: () => getActiveStores(),
  });
};

export const useGetStoreDetail = (id: string) => {
  return useQuery<IStore, Error>({
    queryKey: ['store', id],
    queryFn: () => getStoreDetail(id),
  });
};

export const useUpdateStore = (): UseMutationResult<IStore, Error, { id: string; payload: IUpdateStore }> => {
  return useMutation<IStore, Error, { id: string; payload: IUpdateStore }>({
    mutationFn: ({ id, payload }) => updateStore(id, payload),
  });
};

export const useDeleteStore = (): UseMutationResult<void, Error, string> => {
  return useMutation<void, Error, string>({
    mutationFn: (id: string) => deleteStore(id),
  });
};