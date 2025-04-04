import { sendGet, sendPost, sendPatch, sendDelete } from "../apiClient";
import { ConfigImageEndPoint } from "./contants";

export interface IImage {
  id: string;
  url: string;
  description: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IUploadImage {
  file: File;
  description?: string;
  isPublic?: boolean;
}

export interface IUpdateImage {
  description?: string;
  isPublic?: boolean;
}

export interface IImageListResponse {
  data: IImage[];
  meta: {
    page: number;
    take: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export const uploadImage = async (payload: IUploadImage): Promise<IImage> => {
  const formData = new FormData();
  formData.append('file', payload.file);
  if (payload.description) formData.append('description', payload.description);
  if (payload.isPublic !== undefined) formData.append('isPublic', payload.isPublic.toString());
  
  const res = await sendPost(ConfigImageEndPoint.UPLOAD, formData);
  return res;
};

export const getImages = async (page: number = 1, take: number = 10): Promise<IImageListResponse> => {
  const res = await sendGet(`${ConfigImageEndPoint.GET_LIST}?page=${page}&take=${take}`);
  return res;
};

export const linkImageToProduct = async (productId: string, imageId: string): Promise<void> => {
  await sendPost(ConfigImageEndPoint.LINK_TO_PRODUCT(productId, imageId), {});
};

export const getProductImages = async (productId: string, page: number = 1, take: number = 10): Promise<IImageListResponse> => {
  const res = await sendGet(`${ConfigImageEndPoint.GET_PRODUCT_IMAGES(productId)}?page=${page}&take=${take}`);
  return res;
};

export const deleteProductImage = async (id: string): Promise<void> => {
  await sendDelete(ConfigImageEndPoint.DELETE_PRODUCT_IMAGE(id));
};

export const getImageDetail = async (id: string): Promise<IImage> => {
  const res = await sendGet(ConfigImageEndPoint.GET_DETAIL(id));
  return res;
};

export const updateImage = async (id: string, payload: IUpdateImage): Promise<IImage> => {
  const res = await sendPatch(ConfigImageEndPoint.UPDATE(id), payload);
  return res;
};

export const deleteImage = async (id: string): Promise<void> => {
  await sendDelete(ConfigImageEndPoint.DELETE(id));
};

export const getImageFile = async (filename: string): Promise<Blob> => {
  const res = await sendGet(ConfigImageEndPoint.GET_FILE(filename), { responseType: 'blob' });
  return res;
};