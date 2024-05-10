import { CenshareService } from "../services/censhare.service";
import { UpdateCenshareData } from "../types/services/censhare.service.types";
import { AuthedExtendedRequest, AuthedRequest } from "../types/request.types";

export class CenshareController {
  private service = new CenshareService();

  getByUserId = async (req: AuthedRequest) => {
    const { identification } = req;
    const result = await this.service.getByUserId(identification._id);
    return result;
  };

  update = async (req: AuthedExtendedRequest<UpdateCenshareData>) => {
    const { identification, body } = req;
    const { _id } = identification;
    const result = await this.service.update(_id, body);
    return result;
  };
}
