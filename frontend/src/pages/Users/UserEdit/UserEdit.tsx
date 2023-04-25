import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserForm } from '../UserForm/UserForm';
import { User } from '../user-model';
import { Whoops } from '../../../ui/Whoops/Whoops';
import { Loading } from '../../../ui/Loading/Loading';
import { useGetUserById, useUpdateUser } from '../../../api/queries/users';

export function UserEdit() {
  const {id} = useParams();
  const {data, loading, error} = useGetUserById(id!, true);
  const navigate = useNavigate();
  const [updateUser, {loading: updateLoading, error: updateError}] = useUpdateUser(true);

  const handleSubmit = async (user: Omit<User, "id"> & {id?: string}) => {
    await updateUser({
      variables: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      onCompleted:  () => {
        navigate('/');
      }
    })
  }

  if (!data?.getById) {
    return <div>404</div>
  }

  if (error || updateError) {
    return <Whoops />
  }

  if (loading || updateLoading) {
    return <Loading />
  }

  return <UserForm title={`Edit user #${data?.getById?.id}`} defaultUser={data?.getById} onSubmit={handleSubmit}/>;
}
