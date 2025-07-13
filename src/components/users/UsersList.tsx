import { getUsers } from '@/services/users';
import { userKeys } from '@/tanstack/keys/userKeys';
import type { User } from '@/types/User';
import { axiosInstance } from '@/utils/axiosInstance';
import { useSuspenseQuery } from '@tanstack/react-query';

const UsersList = () => {
  const { data: users } = useSuspenseQuery({
    queryKey: userKeys.all(),
    queryFn: async () => {
      return getUsers(axiosInstance);
    },
    select: (data: { users: User[] }) => data.users,
  });

  return (
    <ul className='list-disc pl-5'>
      {users.map((user) => (
        <li key={user.id} className='mb-2'>
          <div>
            {user.firstName} {user.lastName} ({user.email})
          </div>
          <div>Role: {user.role}</div>
          {user.organization && (
            <div>
              <div>
                Organization: {user.organization.name} ({user.organization.id})
              </div>
              <div>Url: {user.organization.websiteUrl}</div>
              <div>Logo Url: {user.organization.logoUrl}</div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default UsersList;
