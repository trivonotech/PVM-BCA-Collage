import { ReactNode, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/admin/login');
        }
    }, [isAuthenticated, navigate]);

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return <>{children}</>;
}
