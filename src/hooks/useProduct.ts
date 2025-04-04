// product.hooks.ts

import { useMutation, UseMutationResult, useQuery } from "@tanstack/react-query";
import { createProduct, getProducts, getProductDetail, updateProduct, deleteProduct, confirmSpin } from "@/api/services/product.service";
import { IProduct, ICreateProduct, IUpdateProduct, IProductListResponse, IConfirmSpin } from "@/api/services/product.service";

export const useCreateProduct = (): UseMutationResult<IProduct, Error, ICreateProduct> => {
  return useMutation<IProduct, Error, ICreateProduct>({
    mutationFn: (params: ICreateProduct) => createProduct(params),
  });
};

export const useGetProducts = (page: number = 1, take: number = 10) => {
  return useQuery<IProductListResponse, Error>({
    queryKey: ['products', page, take],
    queryFn: () => getProducts(page, take),
  });
};

export const useGetProductDetail = (id: string) => {
  return useQuery<IProduct, Error>({
    queryKey: ['product', id],
    queryFn: () => getProductDetail(id),
  });
};

export const useUpdateProduct = (): UseMutationResult<IProduct, Error, { id: string; payload: IUpdateProduct }> => {
  return useMutation<IProduct, Error, { id: string; payload: IUpdateProduct }>({
    mutationFn: ({ id, payload }) => updateProduct(id, payload),
  });
};

export const useDeleteProduct = (): UseMutationResult<void, Error, string> => {
  return useMutation<void, Error, string>({
    mutationFn: (id: string) => deleteProduct(id),
  });
};

export const useConfirmSpin = (): UseMutationResult<void, Error, IConfirmSpin> => {
  return useMutation<void, Error, IConfirmSpin>({
    mutationFn: (params: IConfirmSpin) => confirmSpin(params),
  });
};