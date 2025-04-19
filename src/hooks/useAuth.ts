// auth.hooks.ts

import { 
  FormUpdateBank, 
  getListBank, 
  getProfile, 
  getTransaction, 
  IAuthResponse, 
  ILogin, 
  ISignIn, 
  IUserProfile, 
  IBank,
  register, 
  signIn, 
  updateBankUser, 
  updateInfoUser,
  getAvailableSpinProducts,
  spinProduct,
  getSpinConfig,
  updateSpinConfig,
  confirmSpin,
  ISpinProduct,
  ISpinResult,
  ISpinConfig,
  IUpdateSpinConfig,
  getSpinHistory,
  ISpinHistoryItem,
  ISpinHistoryResponse
} from "@/api/services/auth.service";
import Cookies from "js-cookie";
import { useMutation, UseMutationResult, useQuery, useQueryClient } from "@tanstack/react-query";

export const useSignIn = (): UseMutationResult<{data: any}, Error, ILogin> => {
  return useMutation<any, Error, ILogin>({
    mutationFn: (params: ILogin) => signIn(params),
    onSuccess: (result: {data: any}) => {
      return result;
    },
    onError: (result: any) => {
      return result;
    },
  });
};

export const useGetProfileData = () => {
  const accessToken = Cookies.get("accessToken");
  const { data: profile, isLoading, isFetching, refetch } = useQuery<{ data: IUserProfile }, Error>({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
    enabled: !!accessToken,
  });

  return { profile, isLoading, isFetching, refetch };
};


export const useRegister = (): UseMutationResult<IAuthResponse, Error, ISignIn & { fullName: string; phone: string }> => {
  return useMutation<any, Error, ISignIn & { fullName: string; phone: string }>({
    mutationFn: (params: any) => register(params),
    onSuccess: (result: IAuthResponse) => {
      return result;
    },
    onError: (result: any) => {
      return result;
    },
  });
};

export const useUpdateBankUser = (): UseMutationResult<any, Error, FormUpdateBank> => {
  const queryClient = useQueryClient();
  
  return useMutation<any, Error, FormUpdateBank>({
    mutationFn: (params: FormUpdateBank) => updateBankUser(params),
    onSuccess: (result: any) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      return result;
    },
    onError: (result: any) => {
      return result;
    },
  });
};

export const useUpdateInfoUser = (): UseMutationResult<any, Error, any> => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, any>({
    mutationFn: (params: any) => updateInfoUser(params),
    onSuccess: (result: any) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      return result;
    },
    onError: (result: any) => {
      return result;
    },
  });
};

export const useGetListBank = () => {
  const { data: listBank, isLoading, isFetching } = useQuery<IBank[], Error>({
    queryKey: ['get-list-bank'],
    queryFn: () => getListBank(),
  });

  return { listBank, isLoading, isFetching };
};

export const useGetTransaction = () => {
  const { data, isLoading, isFetching, refetch } = useQuery<any, Error>({
    queryKey: [`get-transaction`],
    queryFn: () => getTransaction(),
  });

  return { data, isLoading, isFetching, refetch };
};

// Hooks cho tính năng Spin
export const useGetAvailableSpinProducts = () => {
  const { data, isLoading, isFetching } = useQuery<{ data: ISpinProduct[] }, Error>({
    queryKey: ['available-spin-products'],
    queryFn: () => getAvailableSpinProducts(),
  });

  return { spinProducts: data?.data, isLoading, isFetching };
};

export const useSpinProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{ data: ISpinResult }, Error, void>({
    mutationFn: () => spinProduct(),
    onSuccess: () => {
      // Invalidate queries that might be affected by this mutation
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['get-transaction'] });
      queryClient.invalidateQueries({ queryKey: ['available-spin-products'] });
      queryClient.invalidateQueries({ queryKey: ['spin-history'] });
    },
  });
};

export const useGetSpinConfig = (userId: string) => {
  const { data, isLoading, isFetching } = useQuery<{ data: ISpinConfig }, Error>({
    queryKey: ['spin-config', userId],
    queryFn: () => getSpinConfig(userId),
    enabled: !!userId, // Only run the query if userId is provided
  });

  return { spinConfig: data?.data, isLoading, isFetching };
};

export const useUpdateSpinConfig = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{ data: ISpinConfig }, Error, { userId: string; config: IUpdateSpinConfig }>({
    mutationFn: ({ userId, config }) => updateSpinConfig(userId, config),
    onSuccess: (_, variables) => {
      // Invalidate the specific spin config query
      queryClient.invalidateQueries({ queryKey: ['spin-config', variables.userId] });
    },
  });
};

export const useConfirmSpin = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{ data: any }, Error, void>({
    mutationFn: () => confirmSpin(),
    onSuccess: () => {
      // Invalidate queries that might be affected by this mutation
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['get-transaction'] });
    },
  });
};

// Thêm hook để lấy lịch sử quay
export const useGetSpinHistory = (params?: { page: number; take: number; order?: 'ASC' | 'DESC' }) => {
  const defaultParams = { page: 1, take: 10, order: 'DESC' as const };
  const queryParams = params || defaultParams;
  
  const { data, isLoading, isFetching, refetch } = useQuery<ISpinHistoryResponse, Error>({
    queryKey: ['spin-history', queryParams],
    queryFn: () => getSpinHistory(queryParams),
  });

  return { spinHistory: data, isLoading, isFetching, refetch };
};