import { update } from './users/update';
import { list } from './users/list';
import { getById } from './users/get-by-id';
import { create } from './users/create';
import { deleteUser } from './users/delete';
import { User } from '../interfaces/user';

type AppSyncEvent = {
  info: {
    fieldName: string
  },
  arguments: {
    id: string,
    user: User
  }
}

exports.handler = async (event: AppSyncEvent) => {
  switch (event.info.fieldName) {
    case 'createUser':
      return await create({...event.arguments.user});
    case 'updateUser':
      return await update({...event.arguments.user});
    case 'deleteUser':
      return await deleteUser(event.arguments.id);
    case 'list':
      return await list();
    case 'getById':
      return await getById(event.arguments.id);
    default:
      return null;
  }
}
