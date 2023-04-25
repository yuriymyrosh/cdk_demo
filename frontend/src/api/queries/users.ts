import {
  ApolloCache,
  ApolloError,
  MutationFunctionOptions,
  useMutation,
  useQuery
} from "@apollo/client";
import {
  CREATE_USER,
  DELETE_USER,
  GET_USERS,
  GET_USER_BY_ID,
  UPDATE_USER
} from "../schemas";
import { mockUsers } from "../../pages/Users/mock-users";
import { User } from "../../pages/Users/user-model";

export const useGetUsers = (mock = false) => {
  const { data, loading, error } = useQuery(GET_USERS);
  if (!mock) {
    return { data, loading, error };
  } else {
    return {
      loading: false,
      error: false,
      data: {
        list: mockUsers
      }
    };
  }
};

export const useDeleteUser = (
  mock = false
): [
  (options: MutationFunctionOptions) => Promise<any>,
  { loading: boolean; error?: boolean | ApolloError }
] => {
  const [deleteUser, { loading, error }] = useMutation(DELETE_USER);
  if (!mock) {
    return [deleteUser, { loading, error }];
  } else {
    return [
      async (options) => {
        return mockUsers.filter((user) => user.id !== options.variables?.id);
      },
      {
        loading: false,
        error: false
      }
    ];
  }
};

export const useCreateUser = (
  onCompleted: () => void,
  mock = false
): [
  (options: MutationFunctionOptions) => Promise<any>,
  { loading: boolean; error?: boolean | ApolloError; data: { list: User[] } }
] => {
  const [createUser, { data, loading, error }] = useMutation(CREATE_USER, {
    update: (cache: ApolloCache<any>, result) => {
      cache.modify({
        fields: {
          list(existing, { toReference }) {
            return [...existing, toReference(result.data.createUser)];
          }
        }
      });
    },
    onCompleted
  });

  if (!mock) {
    return [createUser, { data, loading, error }];
  } else {
    return [
      async (options: MutationFunctionOptions) => {
        mockUsers.push(options.variables?.user);
        onCompleted();
      },
      { data: { list: mockUsers }, loading, error }
    ];
  }
};

export const useUpdateUser = (
  mock = false
): [
  (options: MutationFunctionOptions) => Promise<any>,
  { loading: boolean; error?: boolean | ApolloError; data: { list: User[] } }
] => {
  const [updateUser, { data, loading, error }] = useMutation(UPDATE_USER);

  if (!mock) {
    return [updateUser, { data, loading, error }];
  } else {
    return [
      async (options: MutationFunctionOptions) => {
        const index = mockUsers.findIndex(
          (user) => user.id === options.variables?.user.id
        );
        mockUsers[index] = {
          ...mockUsers[index],
          ...options.variables!.user
        };

        options!.onCompleted!(null);
      },
      { data: { list: mockUsers }, loading, error }
    ];
  }
};

export const useGetUserById = (id: string, mock = false) => {
  const { data, loading, error } = useQuery(GET_USER_BY_ID, {
    variables: {
      id
    }
  });

  if (!mock) {
    return { data, loading, error };
  } else {
    return {
      data: {
        getById: mockUsers.find((user) => user.id === id)
      },
      loading: false,
      error: false
    };
  }
};
