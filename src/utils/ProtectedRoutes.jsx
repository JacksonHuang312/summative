import { Navigate, Outlet } from 'react-router-dom';
import { useStoreContext } from '../context';

export default function ProtectedRoutes() {
    const { user, authLoading } = useStoreContext();

    // While checking auth state, return nothing (or a loading spinner)
    if (authLoading) {
        return (
            <div style={{ 
                height: '100vh', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                backgroundColor: '#1a1a1a',
                color: 'white'
            }}>
                Loading...
            </div>
        );
    }

    // After auth check is complete, either show the protected route or redirect to login
    return user ? <Outlet /> : <Navigate to="/login" />;
}