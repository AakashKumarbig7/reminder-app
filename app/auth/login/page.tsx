
import LogIn from '@/components/login';
import { login } from '@/lib/data';
import Link from 'next/link';

export default function LoginPage() {

	async function handleSubmit(values: any) {
		'use server'
		await login(values)
	}

	return (
		<div className="max-w-md mx-auto py-10 px-5">
			<h1 className="text-2xl font-bold mb-5">Log In</h1>
			<LogIn handleSubmit={handleSubmit} />
			<p className='text-center mt-2 text-sm'>Don't hava a account? <Link href='/auth/signup' className='underline text-primary-background'>Signup</Link></p>
		</div>
	);
}
