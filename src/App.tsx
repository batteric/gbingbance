import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProtectedRoute } from './app/ProtectedRoute';
import { AppShell } from './components/layout/AppShell';
import { LandingPage } from './features/home/LandingPage';
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';
import { HomePage } from './features/home/HomePage';
import { SalonsHub } from './features/salons/SalonsHub';
import { RoomView } from './features/salons/RoomView';
import { MessagesPage } from './features/chat/MessagesPage';
import { FriendsPage } from './features/friends/FriendsPage';
import { GamesPage } from './features/games/GamesPage';
import { MusicPage } from './features/music/MusicPage';
import { ProfilePage, PublicProfilePage } from './features/profile/ProfilePage';
import { AdminPage } from './features/admin/AdminPage';
import { Toasts } from './components/ui/Toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 2000,
      refetchOnWindowFocus: true,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<AppShell />}>
              <Route index element={<Navigate to="home" replace />} />
              <Route path="home" element={<HomePage />} />
              <Route path="salons" element={<SalonsHub />} />
              <Route path="salons/:id" element={<RoomView />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="messages/:userId" element={<MessagesPage />} />
              <Route path="friends" element={<FriendsPage />} />
              <Route path="games" element={<GamesPage />} />
              <Route path="games/:mode" element={<GamesPage />} />
              <Route path="music" element={<MusicPage />} />
              <Route path="discover" element={<div className="p-8 text-center text-text-2">Discover / Swipe — bientôt</div>} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="users/:id" element={<PublicProfilePage />} />
              <Route path="admin" element={<AdminPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toasts />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
