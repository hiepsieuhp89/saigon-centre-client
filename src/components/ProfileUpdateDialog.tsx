"use client";

import { useState, useEffect } from "react";
import { useUpdateInfoUser, useGetProfileData } from "@/hooks/useAuth";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box
} from "@mui/material";

interface ProfileUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  user: any | null;
}

export function ProfileUpdateDialog({
  open,
  onClose,
  user,
}: ProfileUpdateDialogProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");

  const { profile } = useGetProfileData();
  const updateInfoMutation = useUpdateInfoUser();

  useEffect(() => {
    if (profile?.data) {
      setFullName(profile.data.fullName || "");
      setEmail(profile.data.email || "");
      setPhone(profile.data.phone || "");
      setAddress(profile.data.address || "");
      setCity(profile.data.city || "");
      setDistrict(profile.data.district || "");
      setWard(profile.data.ward || "");
    }
  }, [profile?.data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile?.data) {
      toast.error("Bạn cần đăng nhập để thực hiện thao tác này");
      return;
    }

    updateInfoMutation.mutate(
      {
        fullName,
        email,
        phone,
        address,
        city,
        district,
        ward
      },
      {
        onSuccess: () => {
          toast.success("Cập nhật thông tin thành công");
          onClose();
        },
        onError: (error) => {
          console.error("Error updating profile:", error);
          toast.error("Có lỗi xảy ra khi cập nhật thông tin");
        },
      }
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Cập nhật thông tin cá nhân</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Họ và tên"
              fullWidth
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              variant="outlined"
            />

            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              variant="outlined"
            />

            <TextField
              label="Số điện thoại"
              type="tel"
              fullWidth
              value={phone.replace(/./g, '*')}
              onChange={(e) => setPhone(e.target.value)}
              required
              variant="outlined"
              disabled={true}
            />

            <TextField
              label="Tên tài khoản"
              type="tel"
              fullWidth
              value={user?.username}
              required
              variant="outlined"
              disabled={true}
            />

            {/* <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Box sx={{ fontSize: '0.75rem', color: 'rgba(0, 0, 0, 0.6)', ml: 1 }}>
                Thông tin địa chỉ
              </Box>
              <Box sx={{ border: '1px solid rgba(0, 0, 0, 0.23)', borderRadius: 1, p: 1.5 }}>
                {address && <Box sx={{ mb: 0.5 }}><strong>Địa chỉ:</strong> {address}</Box>}
                {ward && <Box sx={{ mb: 0.5 }}><strong>Phường/Xã:</strong> {ward}</Box>}
                {district && <Box sx={{ mb: 0.5 }}><strong>Quận/Huyện:</strong> {district}</Box>}
                {city && <Box><strong>Thành phố:</strong> {city}</Box>}
                {!address && !ward && !district && !city && (
                  <Box sx={{ color: 'text.secondary' }}>Chưa có thông tin địa chỉ</Box>
                )}
              </Box>
            </Box> */}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            color="inherit"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={updateInfoMutation.isPending}
          >
            {updateInfoMutation.isPending ? "Đang xử lý..." : "Cập nhật"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 