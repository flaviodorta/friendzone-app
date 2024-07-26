import User from './user';

export default interface SignIn {
  access_token: string;
  user: User;
}
