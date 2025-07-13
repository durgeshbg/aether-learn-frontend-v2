import { Button } from '../ui/button';
import { Outlet, useNavigate } from 'react-router';
import { routes } from '@/static-data/routes';

const Users = () => {
  const navigate = useNavigate();

  const handleAddUser = () => {
    navigate(routes.USER_CREATE);
  };

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Users</h1>
      <div className='flex mb-4'>
        <Button
          onClick={() => navigate(routes.USERS)}
          className='bg-gray-200 text-gray-800 px-4 py-2 rounded mr-2'
        >
          View Users
        </Button>
        <Button
          onClick={handleAddUser}
          className='bg-blue-500 text-white px-4 py-2 rounded'
        >
          Add User
        </Button>
      </div>
      <Outlet />
    </div>
  );
};

export default Users;
