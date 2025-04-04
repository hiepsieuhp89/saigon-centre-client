import { useGetListBank } from '@/hooks/useAuth';
import { message } from 'antd';
import { useFormik } from 'formik';
import { Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface DepositDialogProps {
	open: boolean;
	onClose: () => void;
	user: any;
}

export function DepositDialog({ open, onClose, user }: DepositDialogProps) {
	const router = useRouter();
	const [messageApi, contextHolder] = message.useMessage();
	const { listBank } = useGetListBank();

	const formik = useFormik({
		initialValues: {
			amount: undefined,
		},
		validationSchema: Yup.object({
			amount: Yup.number()
				.required('Vui lòng nhập số tiền')
				.min(200, 'Số tiền tối thiểu là 200 USD'),
		}),
		onSubmit: async (values) => {
			try {
				const payload = {
					amount: String(values.amount || 0),
				};
				const queryString = new URLSearchParams(payload).toString();
    
				router.push(`/confirm-recharge?${queryString}`);
			} catch (error) {
				messageApi.error('Có lỗi xảy ra khi nạp tiền. Vui lòng thử lại!');
			}
		}
	});

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				{contextHolder}
				<DialogHeader>
					<DialogTitle className="text-center text-xl font-bold text-[#C00000]">
						Nạp Tiền
					</DialogTitle>
					<DialogDescription className="text-center">
						Vui lòng điền đầy đủ thông tin để nạp tiền vào tài khoản
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={formik.handleSubmit} className="space-y-4">
					<Alert>
						<Info className="h-4 w-4" />
						<AlertTitle>Lưu ý quan trọng</AlertTitle>
						<AlertDescription>
							<ul className="list-disc pl-4">
								<li>Thời gian xử lý: 5-15 phút trong giờ hành chính</li>
								{/* <li>Vui lòng ghi đúng nội dung chuyển khoản</li> */}
							</ul>
						</AlertDescription>
					</Alert>

					<div className="space-y-2">
						<Label htmlFor="amount">Số tiền (USD)</Label>
						<Input
							id="amount"
							type="number"
							placeholder="Nhập số tiền"
							{...formik.getFieldProps('amount')}
						/>
						{formik.touched.amount && formik.errors.amount && (
							<p className="text-red-500 text-sm">{formik.errors.amount}</p>
						)}
					</div>

					<Button type="submit" className="w-full" disabled={formik.isSubmitting}>
						{formik.isSubmitting ? 'Đang xử lý...' : 'Tiếp tục'}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
} 