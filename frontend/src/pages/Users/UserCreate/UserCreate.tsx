import React from "react";
import { UserForm } from "../UserForm/UserForm";
import { User } from "../user-model";
import { v4 as uuid } from "uuid";
import { Loading } from "../../../ui/Loading/Loading";
import { useNavigate } from "react-router-dom";
import { Whoops } from "../../../ui/Whoops/Whoops";
import { useCreateUser } from "../../../api/queries/users";

export function UserCreate() {
  const navigate = useNavigate();
  const [createUser, {loading, error }] = useCreateUser(() => {
    navigate("/");
  }, true);

  const handleSubmit = async (user: Omit<User, "id">) => {
    await createUser({
      variables: {
        user: {
          id: uuid(),
          name: user.name,
          email: user.email
        }
      }
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Whoops />;
  }

  return <UserForm title="Create user" onSubmit={handleSubmit} />;
}
