// components/ProtectedRoute.js

'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/authProvider';
import { ReactNode, useEffect } from 'react';


interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles: string[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, role, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || !allowedRoles.includes(role))) {
            router.replace(`/unauthorized`);  // Redirect to unauthorized page if role doesn't match
        }
    }, [user, role, loading, allowedRoles, router]);

    if (loading || !user || !allowedRoles.includes(role)) {
        return <p>Loading...</p>;
    }

    return children;
}
