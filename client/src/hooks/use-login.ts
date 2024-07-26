import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import api from '@/api';
import SignIn from '@/interfaces/sign-in';
import { useAuthContext } from '@/context/auth.context';

const signIn = async (data: { email: string; password: string }) => {
  const response = await api.post('/auth/sign-in', data);
  return response.data;
};

const useSignIn = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuthContext();

  return useMutation(signIn, {
    onSuccess: (data: SignIn) => {
      localStorage.setItem('access_token', data.access_token);
      api.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${data.access_token}`;
      setIsAuthenticated(true);
      navigate('/feed');
    },
    onError: () => {
      console.log('login error');
    },
  });
};

export default useSignIn;
