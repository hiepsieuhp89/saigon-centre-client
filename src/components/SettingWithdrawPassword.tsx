import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { useForm, Controller } from 'react-hook-form';

interface WithdrawDialogProps {
  open: boolean;
  onClose: () => void;
  user: any; // You might want to define a more specific type for user
}

interface FormValues {
  newPassword: string;
  confirmPassword: string;
}

export default function SettingWithdrawPassword({ open, onClose, user }: WithdrawDialogProps) {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange', // Validate on change for real-time feedback
  });

  const newPasswordValue = watch('newPassword'); // Watch newPassword to compare with confirmPassword

  const onSubmit = (data: FormValues) => {
    console.log('Form Submitted:', data);
    // Add your logic here to handle the password update (e.g., API call)
    reset(); // Reset form after submission
    onClose(); // Close the modal
  };

  // Reset form when modal closes
  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      title="Set Withdrawal Password"
      open={open}
      onCancel={handleCancel}
      footer={null} // Custom footer with submit button below
      className="max-w-md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* New Withdrawal Password Field */}
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
            New Withdrawal Password
          </label>
          <Controller
            name="newPassword"
            control={control}
            rules={{
              required: 'This field is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters long',
              },
              validate: (value) =>
                value !== user?.username || 'Password cannot be the same as your username',
            }}
            render={({ field }) => (
              <Input.Password
                {...field}
                id="newPassword"
                placeholder="Enter new password"
                className="w-full"
              />
            )}
          />
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: 'This field is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters long',
              },
              validate: (value) =>
                value === newPasswordValue || 'Passwords do not match',
            }}
            render={({ field }) => (
              <Input.Password
                {...field}
                id="confirmPassword"
                placeholder="Confirm your password"
                className="w-full"
              />
            )}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="primary"
            htmlType="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Submit
          </Button>
        </div>
      </form>
    </Modal>
  );
}