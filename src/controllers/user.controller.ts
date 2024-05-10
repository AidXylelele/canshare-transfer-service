import {
  Login,
  Refresh,
  FinalStep,
  InitialStep,
  ChangePassword,
} from "../types/services/user.service.types";
import {
  AuthedRequest,
  ExtendedRequest,
  AuthedExtendedRequest,
} from "../types/request.types";
import { UserService } from "../services/user.service";

export class UserController {
  private service = new UserService();

  initRegistration = async (req: ExtendedRequest<InitialStep>) => {
    const { body } = req;
    const result = await this.service.createAccount(body);
    return result;
  };

  finishRegistration = async (req: AuthedExtendedRequest<FinalStep>) => {
    const { body, identification } = req;
    const data = { ...body, ...identification };
    const result = this.service.fillInAccount(data);
    return result;
  };

  login = async (req: ExtendedRequest<Login>) => {
    const { body } = req;
    const result = await this.service.login(body);
    return result;
  };

  refresh = async (req: ExtendedRequest<Refresh>) => {
    const { body } = req;
    const result = await this.service.refresh(body);
    return result;
  };

  getById = async (req: AuthedRequest) => {
    const { identification } = req;
    const result = await this.service.getById(identification._id);
    return result;
  };

  getByEmail = async (req: ExtendedRequest<InitialStep>) => {
    const { body } = req;
    const result = await this.service.getByEmail(body.email);
    return result;
  };

  changePassword = async (req: AuthedExtendedRequest<ChangePassword>) => {
    const { body, identification } = req;
    await this.service.changePassword(identification._id, body);
  };

  delete = async (req: AuthedRequest) => {
    const { identification } = req;
    await this.service.delete(identification._id);
  };
}
