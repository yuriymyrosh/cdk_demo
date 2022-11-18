import React, { useEffect, useState, MouseEvent } from 'react';
import { NavLink } from 'react-router-dom';
import { User } from '../user-model';
import { ApolloCache, gql, Reference, useMutation, useQuery } from '@apollo/client';
import { Loading } from '../../../ui/Loading/Loading';
import { Whoops } from '../../../ui/Whoops/Whoops';

const GET_USERS = gql`
    query UsersQuery {
        list {
            id
            name
            email
        }
    }
`;

const DELETE_USER = gql`
    mutation DeleteUser($id: String!) {
        deleteUser(id: $id) {
            deleted
        }
    }
`;

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const {data, loading, error} = useQuery(GET_USERS);
  const [deleteUser, {data: userDeleted, loading: deleteLoading, error: deleteError}] = useMutation(DELETE_USER);

  useEffect(() => {
    if (data?.list) {
      setUsers(data.list);
    }
  }, [data?.list]);

  if (loading || deleteLoading) {
    return <Loading/>
  }

  if (error || deleteError) {
    return <Whoops/>
  }

  const handleDelete = async (e: MouseEvent<HTMLAnchorElement>, id: number) => {
    e.preventDefault();
    await deleteUser({
      variables: {
        id
      },
      update: (cache: ApolloCache<any>) => {
        cache.modify({
          fields: {
            list(existing, {readField}) {
              return existing.filter((item: Reference) => readField('id', item) !== id);
            }
          }
        })
      }
    });

    setUsers(users.filter(user => user.id !== id));
  }

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="flex justify-between py-3 pl-2">
          <div className="relative max-w-xs">
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <button
                className="relative z-0 inline-flex text-sm rounded-md shadow-sm focus:ring-accent-500 focus:border-accent-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1">
                  <span
                    className="relative inline-flex items-center px-3 py-3 space-x-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md sm:py-2">
                      <NavLink to={'new'}>
                        <div className="hidden sm:block">Add new</div>
                      </NavLink>
                  </span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-1.5 w-full inline-block align-middle">
          <div className="overflow-hidden border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3 pl-4">
                  <div className="flex items-center h-5">
                    <input
                      id="checkbox-all"
                      type="checkbox"
                      className="text-blue-600 border-gray-200 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="checkbox"
                      className="sr-only"
                    >
                      Checkbox
                    </label>
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                >
                  Edit
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                >
                  Delete
                </th>
              </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
              {users.map(user => <tr key={user.id}>
                <td className="py-3 pl-4">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      className="text-blue-600 border-gray-200 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="checkbox"
                      className="sr-only"
                    >
                      Checkbox
                    </label>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                  {user.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                  {user.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                  <NavLink to={user.id.toString()} className="text-green-500 hover:text-green-700">Edit</NavLink>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                  <a
                    className="text-red-500 hover:text-red-700"
                    href="/delete"
                    onClick={(e) => handleDelete(e, user.id)}
                  >
                    Delete
                  </a>
                </td>
              </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
