import { getUsers } from '@/services/user';
import { userKeys } from '@/tanstack/keys/userKeys';
import type { User } from '@/types/User';
import { axiosInstance } from '@/utils/axiosInstance';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router';
import { routes } from '@/static-data/routes';

const UsersList = () => {
  const navigate = useNavigate();
  const { data: users } = useSuspenseQuery({
    queryKey: userKeys.all(),
    queryFn: async () => {
      return getUsers(axiosInstance);
    },
    select: (data: { users: User[] }) => data.users,
  });

  return (
    <ul className='list-disc pl-5'>
      {users?.map((user) => (
        <li key={user.id} className='mb-2'>
          <Button
            variant='outline'
            className='w-full justify-start'
            onClick={() => {
              navigate(routes.USER_DETAILS(user.id));
            }}
          >
            <div>
              {user.firstName} {user.lastName} ({user.email})
            </div>
            <div>Role: {user.role}</div>
          </Button>
        </li>
      ))}
    </ul>
  );
};

export default UsersList;
