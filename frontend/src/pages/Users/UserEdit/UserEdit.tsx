import { useNavigate, useParams } from 'react-router-dom';
import { UserForm } from '../UserForm/UserForm';
import { PartialBy } from '../../../utils/partialBy';
import { User } from '../user-model';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Whoops } from '../../../ui/Whoops/Whoops';
import { Loading } from '../../../ui/Loading/Loading';

const GET_USER_BY_ID = gql`
    query GetUser ($id: String!) {
        getById(id: $id) {
            id,
            name,
            email,
        }
    }
`;

const UPDATE_USER = gql`
    mutation UpdateUser ($user: UserInput!) {
        updateUser(user: $user) {
            id,
            name,
            email,
        }
    }
`;

export function UserEdit() {
  const {id} = useParams();
  const {data, loading, error} = useQuery(GET_USER_BY_ID, {
    variables: {
      id,
    }
  });
  const [updateUser, {data: updatedUser, loading: updateLoading, error: updateError}] = useMutation(UPDATE_USER);
  const navigate = useNavigate();

  const handleSubmit = async (user: PartialBy<User, 'id'>) => {
    await updateUser({
      variables: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      onCompleted: () => {
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
