import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './screens/login';
import ProtectedRoute from './components/protected-route';
import Feed from './screens/feed';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './context/auth.context';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Login />} path='/login' />
            <Route element={<ProtectedRoute />}>
              <Route element={<Feed />} path='/feed' />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
