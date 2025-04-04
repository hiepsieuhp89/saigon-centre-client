// category.hooks.ts

import { ICategory, ICreateCategory, IUpdateCategory, ICategoryListResponse,createCategory, getCategories, getCategoryDetail, updateCategory, deleteCategory  } from "@/api/services/category.service";
import { useMutation, UseMutationResult, useQuery } from "@tanstack/react-query";

export const useCreateCategory = (): UseMutationResult<ICategory, Error, ICreateCategory> => {
  return useMutation<ICategory, Error, ICreateCategory>({
    mutationFn: (params: ICreateCategory) => createCategory(params),
  });
};

export const useGetCategories = (page: number = 1, take: number = 10) => {
  return useQuery<ICategoryListResponse, Error>({
    queryKey: ['categories', page, take],
    queryFn: () => getCategories(page, take),
  });
};

export const useGetCategoryDetail = (id: string) => {
  return useQuery<ICategory, Error>({
    queryKey: ['category', id],
    queryFn: () => getCategoryDetail(id),
  });
};

export const useUpdateCategory = (): UseMutationResult<ICategory, Error, { id: string; payload: IUpdateCategory }> => {
  return useMutation<ICategory, Error, { id: string; payload: IUpdateCategory }>({
    mutationFn: ({ id, payload }) => updateCategory(id, payload),
  });
};

export const useDeleteCategory = (): UseMutationResult<void, Error, string> => {
  return useMutation<void, Error, string>({
    mutationFn: (id: string) => deleteCategory(id),
  });
};