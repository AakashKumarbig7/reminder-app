
import SignUp from '@/components/signup';
import { signup } from '@/lib/data';
import Link from 'next/link';

export default function SignUpPage() {

  async function handleSubmit(values: any) {
    'use server'
    await signup(values)
  }


  return (
    <div className="max-w-md mx-auto py-10 px-5">
      <h1 className="text-2xl font-bold mb-5">Sign Up</h1>
      <SignUp handleSubmit={handleSubmit} />
      <p className='text-center mt-2 text-sm'>Already hava a account? <Link href='/login' className='underline text-primary-background'>Login</Link></p>
    </div>
  );
}
