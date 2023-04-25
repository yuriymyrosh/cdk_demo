import React, { useState } from "react";
import { User } from "../user-model";
import { NavLink } from "react-router-dom";

export interface UserFormProps {
  title: string;
  defaultUser?: User;
  onSubmit: (user: Omit<User, "id"> & { id?: string }) => void;
}

export const UserForm: React.FC<UserFormProps> = ({
  title,
  defaultUser,
  onSubmit
}) => {
  const [user, setUser] = useState<Omit<User, "id">>({
    name: "",
    email: "",
    ...defaultUser
  });
  const [vlaidationErrors, setValidationErrors] = useState<
    Record<keyof Omit<User, "id">, string>
  >({
    name: "",
    email: ""
  });

  const handleNameChange = (name: string) => {
    setUser((prevState) => ({ ...prevState, name }));

    let nameError = "";
    if (name.length < 4) {
      nameError = "Please enter valid name";
    }

    setValidationErrors((prevState) => ({
      ...prevState,
      name: nameError
    }));
  };

  const handleEmailChange = (email: string) => {
    setUser((prevState) => ({ ...prevState, email }));

    let emailError = "";
    const re =
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    if (email.length < 3 || !re.test(email)) {
      emailError = "Please enter valid email";
    }

    setValidationErrors((prevState) => ({
      ...prevState,
      email: emailError
    }));
  };

  const handleSubmit = () => {
    if (!vlaidationErrors.email && !vlaidationErrors.name) {
      onSubmit(user);
    }
  };

  const isDisabled = () => {
    return (
      !user.name ||
      !user.email ||
      !!vlaidationErrors.name ||
      !!vlaidationErrors.email
    );
  };

  return (
    <div className="mt-8 max-w-md p-5">
      <div className="header flex mb-5">
        <NavLink to="/" className="inline-flex w-5 h-5 mr-2">
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
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            ></path>
          </svg>
        </NavLink>
        <h1 className="font-bold">{title}</h1>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <label className="block">
          <span className="text-gray-700">Full name</span>
          <input
            type="text"
            required
            className="
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
            onChange={(e) => handleNameChange(e.target.value)}
          />
          {vlaidationErrors.name && (
            <p className="text-red-700 font-light">{vlaidationErrors.name}</p>
          )}
        </label>
        <label className="block">
          <span className="text-gray-700">Email address</span>
          <input
            type="email"
            className="
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
            onChange={(e) => handleEmailChange(e.target.value)}
          />
          {vlaidationErrors.email && (
            <p className="text-red-700 font-light">{vlaidationErrors.email}</p>
          )}
        </label>
        <label className="block">
          <button
            type="submit"
            disabled={isDisabled()}
            onClick={() => handleSubmit()}
            className="disabled:opacity-75 group relative w-full flex justify-center
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
  );
};
