import { Role } from '../helpers/roles';

export default interface User {
  id: number;
  username: string;
  password: string;
  role: Role;
}
