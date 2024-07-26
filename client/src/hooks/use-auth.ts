import api from '@/api';
import { useAuthContext } from '@/context/auth.context';
import { useMutation } from 'react-query';

const auth = async () => {
  const token_ls = localStorage.getItem('access_token');
  const response = await api.post('/auth/verify-token', {
    access_token: token_ls,
  });
  return response.data;
};

const useAuth = () => {
  const { setIsAuthenticated } = useAuthContext();

  return useMutation(auth, {
    onSuccess: () => {
      setIsAuthenticated(true);
    },
    onError: () => {
      setIsAuthenticated(false);
    },
  });
};

export default useAuth;
