import { User } from '../user-model';
import { PartialBy } from '../../../utils/partialBy';
import { useState } from 'react';

export interface UserFormProps {
  title: string;
  defaultUser?: User;
  onSubmit: (user: PartialBy<User, 'id'>) => void
}

export function UserForm({title, defaultUser, onSubmit}: UserFormProps) {

  const [user, setUser] = useState<PartialBy<User, 'id'>>({
    name: '',
    email: '',
    ...defaultUser,
  });

  return <div className="mt-8 max-w-md p-5">
    <h1 className="font-bold">{title}</h1>
    <div className="grid grid-cols-1 gap-6">
      <label className="block">
        <span className="text-gray-700">Full name</span>
        <input type="text" className="
                    mt-1
                    block
                    w-full
                    rounded-md
                    border-gray-300
                    shadow-sm
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                  "
               placeholder=""
               value={user.name}
               onChange={(e) => {
                 setUser((prevState) => ({...prevState, name: e.target.value}))
               }}
        />
      </label>
      <label className="block">
        <span className="text-gray-700">Email address</span>
        <input type="email" className="
                    mt-1
                    block
                    w-full
                    rounded-md
                    border-gray-300
                    shadow-sm
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                  "
               placeholder="john@example.com"
               value={user.email}
               onChange={(e) => {
                 setUser((prevState) => ({...prevState, email: e.target.value}))
               }}
        />
      </label>
      <label className="block">
        <button
          type="submit"
          onClick={() => onSubmit(user)}
          className="group relative w-full flex justify-center
                py-2 px-4 border border-transparent text-sm font-medium
                rounded-md text-white bg-indigo-600 hover:bg-indigo-700
                focus:outline-none focus:ring-2 focus:ring-offset-2
                focus:ring-indigo-500"
        >
          Submit
        </button>
      </label>
    </div>
  </div>
}
