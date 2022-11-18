import { UserForm } from '../UserForm/UserForm';
import { User } from '../user-model';
import { PartialBy } from '../../../utils/partialBy';
import { ApolloCache, gql, useMutation } from '@apollo/client';
import {v4 as uuid} from 'uuid';
import { Loading } from '../../../ui/Loading/Loading';
import { useNavigate } from 'react-router-dom';
import { Whoops } from '../../../ui/Whoops/Whoops';

const CREATE_USER = gql`
    mutation createUser($user: UserInput!) {
        createUser(user: $user) {
            email
            id
            name
        }
    }
`;

export function UserCreate() {
  const navigate = useNavigate();
  const [createUser, {data, loading, error}] = useMutation(CREATE_USER, {
    update: (cache: ApolloCache<any>, result) => {
      cache.modify({
        fields: {
          list(existing, { toReference }) {
            return [...existing, toReference(result.data.createUser)]
          }
        }
      })
    },
    onCompleted: (data) => {
      navigate('/');
    }
  });


  const handleSubmit = async (user: PartialBy<User, 'id'>) => {
    await createUser({
      variables: {
        user: {
          id: uuid(),
          name: user.name,
          email: user.email
        }
      }
    });
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Whoops />
  }

  return <UserForm title="Create user" onSubmit={handleSubmit}/>
}
