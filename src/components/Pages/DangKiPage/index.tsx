/* eslint-disable @next/next/no-img-element */
"use client";

import { FormDataLogin, register as registerUser } from "@/api/services/auth.service";
import { useUser } from "@/context/useUserContext";
import { message } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// Import MUI components
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormHelperText,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton
} from "@mui/material";

const RegisterPage: React.FC = () => {
  const { user, login } = useUser();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showWithdrawPassword, setShowWithdrawPassword] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormDataLogin>({
    defaultValues: {
      fullName: "",
      username: "",
      password: "",
      withdrawPassword: "",
      phone: "",
      invitationCode: "",
    },
  });

  const onSubmit: SubmitHandler<FormDataLogin> = async(data) => {
    try {
      const response = await registerUser({
        username: data.username,
        phone: data.phone ,
        withdrawPassword: data.withdrawPassword,
        password: data.password,
        fullName: data.fullName,
        invitationCode: data.invitationCode,
        gate: "website",
      });
  
      login(response?.data);
      toast.success('Đăng ký thành công!');
      
    } catch (error: any) {
      console.log(error);
      message.error(error?.response?.data?.message)
      
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleToggleWithdrawPassword = () => {
    setShowWithdrawPassword((prev) => !prev);
  };

  if (user) {
    router.push("/");
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ p: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ width: '100%', mb: 0 }}>
        <img
          style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
          src="/images/logo/1718975372552-1024x602.png"
          alt="Logo"
        />
      </Box>
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Typography variant="h4" component="h2" align="center" color="error" fontWeight="bold" gutterBottom>
          Đăng ký
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          {/* Full Name */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
              Họ và tên
            </Typography>
            <Controller
              name="fullName"
              control={control}
              rules={{ required: "Trường này là bắt buộc" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  placeholder="Nhập họ và tên"
                  variant="outlined"
                  error={!!errors.fullName}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                    }
                  }}
                />
              )}
            />
            {errors.fullName && (
              <FormHelperText error>{errors.fullName.message}</FormHelperText>
            )}
          </Box>

          {/* Username */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
              Tên đăng nhập
            </Typography>
            <Controller
              name="username"
              control={control}
              rules={{ required: "Trường này là bắt buộc" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  placeholder="Nhập tên đăng nhập"
                  variant="outlined"
                  error={!!errors.username}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                      bgcolor: 'rgba(33, 150, 243, 0.08)'
                    }
                  }}
                />
              )}
            />
            {errors.username && (
              <FormHelperText error>{errors.username.message}</FormHelperText>
            )}
          </Box>

          {/* Password */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
              Mật khẩu đăng nhập
            </Typography>
            <Controller
              name="password"
              control={control}
              rules={{ required: "Trường này là bắt buộc" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  variant="outlined"
                  error={!!errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleTogglePassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                      bgcolor: 'rgba(33, 150, 243, 0.08)'
                    }
                  }}
                />
              )}
            />
            {errors.password && (
              <FormHelperText error>{errors.password.message}</FormHelperText>
            )}
          </Box>


            {/* password withdraw */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
              Mật khẩu rút tiền
            </Typography>
            <Controller
              name="withdrawPassword"
              control={control}
              rules={{ required: "Trường này là bắt buộc" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type={showWithdrawPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  variant="outlined"
                  error={!!errors.withdrawPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleToggleWithdrawPassword}
                          edge="end"
                        >
                          {showWithdrawPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                      bgcolor: 'rgba(33, 150, 243, 0.08)'
                    }
                  }}
                />
              )}
            />
            {errors.withdrawPassword && (
              <FormHelperText error>{errors.withdrawPassword.message}</FormHelperText>
            )}
          </Box>

          {/* Phone */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
              Số điện thoại
            </Typography>
            <Controller
              name="phone"
              control={control}
              rules={{
                required: "Trường này là bắt buộc",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Số điện thoại phải có 10 chữ số",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  placeholder="Nhập số điện thoại"
                  variant="outlined"
                  error={!!errors.phone}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                    }
                  }}
                />
              )}
            />
            {errors.phone && (
              <FormHelperText error>{errors.phone.message}</FormHelperText>
            )}
          </Box>

          {/* Referral Code */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
              Mã bảo lãnh
            </Typography>
            <Controller
              name="invitationCode"
              control={control}
              rules={{ required: "Trường này là bắt buộc" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  placeholder="Nhập mã bảo lãnh"
                  variant="outlined"
                  error={!!errors.invitationCode}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                    }
                  }}
                />
              )}
            />
            {errors.invitationCode && (
              <FormHelperText error>{errors.invitationCode.message}</FormHelperText>
            )}
          </Box>

          {/* Submit Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{ 
                width: '100%',
                height: 45,
                borderRadius: 0
              }}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'ĐĂNG KÝ'}
            </Button>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">
              Bạn đã có tài khoản?{" "}
              <Link href="/dang-nhap" className="text-primary no-underline">
                Đăng nhập
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;