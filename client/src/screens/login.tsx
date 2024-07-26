'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';

import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  // FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useSignIn from '@/hooks/use-login';

const formSchema = z.object({
  email: z.string(),
  password: z.string(),
});

const Login = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const signInMutation = useSignIn();

  const onSubmit = () => {
    console.log('email: ', form.getValues().email);
    console.log('password: ', form.getValues().password);
    const email = form.getValues().email;
    const password = form.getValues().password;

    signInMutation.mutate({ email, password });
  };

  return (
    <div className='bg-[--bg-color] flex-center h-screen'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-3/4 md:w-1/2 lg:w-1/3 2xl:w-1/4 space-y-6 bg-white p-10 rounded-lg shadow-md'
        >
          <h1 className='text-center text-2xl font-bold'>Log in FriendZone</h1>

          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Enter your email' {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder='Enter your password' {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type='submit'>Log In</Button>
        </form>
      </Form>
    </div>
  );
};

export default Login;
