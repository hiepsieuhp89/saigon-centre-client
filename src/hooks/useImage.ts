// image.hooks.ts

import { useMutation, UseMutationResult, useQuery } from "@tanstack/react-query";
import { uploadImage, getImages, linkImageToProduct, getProductImages, deleteProductImage, getImageDetail, updateImage, deleteImage, getImageFile } from "@/api/services/image.service";
import { IImage, IUploadImage, IUpdateImage, IImageListResponse } from "@/api/services/image.service";

export const useUploadImage = (): UseMutationResult<IImage, Error, IUploadImage> => {
  return useMutation<IImage, Error, IUploadImage>({
    mutationFn: (params: IUploadImage) => uploadImage(params),
  });
};

export const useGetImages = (page: number = 1, take: number = 10) => {
  return useQuery<IImageListResponse, Error>({
    queryKey: ['images', page, take],
    queryFn: () => getImages(page, take),
  });
};

export const useLinkImageToProduct = (): UseMutationResult<void, Error, { productId: string; imageId: string }> => {
  return useMutation<void, Error, { productId: string; imageId: string }>({
    mutationFn: ({ productId, imageId }) => linkImageToProduct(productId, imageId),
  });
};

export const useGetProductImages = (productId: string, page: number = 1, take: number = 10) => {
  return useQuery<IImageListResponse, Error>({
    queryKey: ['productImages', productId, page, take],
    queryFn: () => getProductImages(productId, page, take),
  });
};

export const useDeleteProductImage = (): UseMutationResult<void, Error, string> => {
  return useMutation<void, Error, string>({
    mutationFn: (id: string) => deleteProductImage(id),
  });
};

export const useGetImageDetail = (id: string) => {
  return useQuery<IImage, Error>({
    queryKey: ['image', id],
    queryFn: () => getImageDetail(id),
  });
};

export const useUpdateImage = (): UseMutationResult<IImage, Error, { id: string; payload: IUpdateImage }> => {
  return useMutation<IImage, Error, { id: string; payload: IUpdateImage }>({
    mutationFn: ({ id, payload }) => updateImage(id, payload),
  });
};

export const useDeleteImage = (): UseMutationResult<void, Error, string> => {
  return useMutation<void, Error, string>({
    mutationFn: (id: string) => deleteImage(id),
  });
};

export const useGetImageFile = (filename: string) => {
  return useQuery<Blob, Error>({
    queryKey: ['imageFile', filename],
    queryFn: () => getImageFile(filename),
  });
};