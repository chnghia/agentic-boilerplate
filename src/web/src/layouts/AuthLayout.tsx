// src/layouts/AuthLayout.tsx
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-4">
                {/* Nội dung trang Login sẽ hiện ở đây */}
                <Outlet />
            </div>
        </div>
    );
}