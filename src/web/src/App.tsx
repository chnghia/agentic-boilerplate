import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import Layouts
import LandingLayout from '@/layouts/LandingLayout';
import AuthLayout from '@/layouts/AuthLayout';
import AppLayout from '@/layouts/AppLayout';

// Import Pages
import LandingPage from '@/pages/landing';
import LoginPage from '@/pages/auth/LoginPage';
import ChatPage from '@/pages/chat/ChatPage';
import MockChatPage from '@/pages/chat/MockChatPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Group 1: Public Pages (Landing, About...) */}
                <Route element={<LandingLayout />}>
                    <Route path="/" element={<LandingPage />} />
                </Route>

                {/* Group 2: Auth Pages (Login, Register) */}
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<LoginPage />} />
                </Route>

                {/* Group 3: Protected App Pages (Chat, Dashboard) */}
                {/* Logic to check if logged in usually goes here */}
                <Route element={<AppLayout />}>
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/chat/mock" element={<MockChatPage />} />
                    {/* Default to /chat if child route doesn't match */}
                    <Route path="/app" element={<Navigate to="/chat" replace />} />
                </Route>

                {/* 404 Not Found */}
                <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;