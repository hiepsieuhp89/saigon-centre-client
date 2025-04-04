/* eslint-disable @next/next/no-img-element */
"use client";

import { useUser } from "@/context/useUserContext";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useSignIn } from "@/hooks/useAuth";
import toast from 'react-hot-toast';
// ... existing code ...

// Import MUI components
import { 
  Box, 
  Button, 
  Checkbox, 
  Container, 
  FormControlLabel, 
  Paper, 
  TextField, 
  Typography,
  FormHelperText,
  CircularProgress,
  InputAdornment,
  IconButton
} from "@mui/material";
import Link from "next/link";
import { message } from "antd";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// Define form data interface
interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { user, setUser, login } = useUser();
  const { mutate: signIn, isError, isPending } = useSignIn();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    try {
      signIn(
        {
          username: data.username,
          password: data.password,
          gate: "website",
        },
        {
          onSuccess: (response) => {
            login(response?.data);
            toast.success('Đăng nhập thành công!');
          },
          onError: (err: any) => {
            message.error(err?.response?.data?.message);
          },
        }
      );
    } catch (error: any) {
      console.log(error);
      message.error(error?.response?.data?.errors[0]);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  // Redirect if user is already logged in
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
          Đăng nhập
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          {/* Username */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
              Số điện thoại
            </Typography>
            <Controller
              name="username"
              control={control}
              rules={{ required: "Số điện thoại là bắt buộc" }}
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
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
              Mật khẩu
            </Typography>
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Mật khẩu là bắt buộc",
                minLength: {
                  value: 6,
                  message: "Mật khẩu phải có ít nhất 6 ký tự",
                },
              }}
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
                    }
                  }}
                />
              )}
            />
            {errors.password && (
              <FormHelperText error>{errors.password.message}</FormHelperText>
            )}
          </Box>

          {/* Remember Me */}
          <Box sx={{ mb: 3 }}>
            <Controller
              name="rememberMe"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="Ghi nhớ tài khoản"
                />
              )}
            />
          </Box>

          {/* Buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isPending}
              sx={{ 
                width: 162, 
                height: 45,
                borderRadius: 0
              }}
            >
              {isPending ? <CircularProgress size={24} color="inherit" /> : 'ĐĂNG NHẬP'}
            </Button>
            
            <Button
              variant="contained"
              onClick={() => router.push("/dang-ki")}
              sx={{ 
                width: 162, 
                height: 45,
                borderRadius: 0
              }}
            >
              ĐĂNG KÝ
            </Button>
          </Box>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2">
              Chưa có tài khoản?{" "}
              <Link href="/dang-ki" className="text-primary no-underline">
                Đăng ký ngay
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
