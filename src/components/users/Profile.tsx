import Loading from '@/containers/loading/loading';
import { useAuth } from '@/hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return <Loading />;
  }

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Profile</h1>
      <div className='mb-2'>
        <strong>First Name:</strong> {user.firstName}
      </div>
      <div className='mb-2'>
        <strong>Last Name:</strong> {user.lastName}
      </div>
      <div className='mb-2'>
        <strong>Email:</strong> {user.email}
      </div>
      <div className='mb-2'>
        <strong>Role:</strong> {user.role}
      </div>
      {user.organization && (
        <div>
          <strong>Organization:</strong> {user.organization.name} (
          {user.organization.id})
        </div>
      )}
    </div>
  );
};

export default Profile;
