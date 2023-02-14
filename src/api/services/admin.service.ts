import { UserService } from './user.service';
import AdminModel from '../models/admin.model';

class Admin extends UserService {
  constructor() {
    super();
    this.model = AdminModel;
  }
}

export default new Admin();
