import React, { useEffect, useState, MouseEvent } from "react";
import { NavLink } from "react-router-dom";
import { User } from "../user-model";
import { Loading } from "../../../ui/Loading/Loading";
import { Whoops } from "../../../ui/Whoops/Whoops";
import { useDeleteUser, useGetUsers } from "../../../api/queries/users";

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);

  const { data, loading, error } = useGetUsers(true);
  const [deleteUser, { loading: deleteLoading, error: deleteError }] =
    useDeleteUser(true);

  useEffect(() => {
    if (data?.list) {
      setUsers(data.list);
    }
  }, [data?.list]);

  if (loading || deleteLoading) {
    return <Loading />;
  }

  if (error || deleteError) {
    return <Whoops />;
  }

  const handleDelete = async (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    await deleteUser({
      variables: {
        id
      }
      // update: (cache: ApolloCache<any>) => {
      //   cache.modify({
      //     fields: {
      //       list(existing, {readField}) {
      //         return existing.filter((item: Reference) => readField('id', item) !== id);
      //       }
      //     }
      //   })
      // }
    });

    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div className="flex flex-col px-3">
      <div className="overflow-x-hidden">
        <div className="flex justify-between py-3 pl-2">
          <div className="relative max-w-xs"></div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <button className="relative z-0 inline-flex text-sm rounded-md shadow-sm focus:ring-accent-500 focus:border-accent-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1">
                <span className="relative inline-flex items-center px-3 py-3 space-x-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md sm:py-2">
                  <NavLink to={"new"}>Add new</NavLink>
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-1.5 w-full inline-block align-middle">
          <div className="overflow-x-scroll sm:overflow-x-hidden border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase hidden sm:table-cell"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap hidden sm:table-cell">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-medium text-right flex items-center justify-end">
                      <NavLink
                        to={user.id.toString()}
                        className="inline-flex w-5 h-5 text-green"
                      >
                        <svg
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                          ></path>
                        </svg>
                        <span className="sr-only">Edit</span>
                      </NavLink>
                      <a
                        className="inline-flex w-5 h-5 text-red"
                        href="/delete"
                        onClick={(e) => handleDelete(e, user.id)}
                      >
                        <svg
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          ></path>
                        </svg>
                        <span className="sr-only">Delete</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
