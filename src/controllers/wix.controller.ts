import { WixService } from "../services/wix.service";
import { UpdateWixData } from "../types/services/wix.service.types";
import { AuthedExtendedRequest, AuthedRequest } from "../types/request.types";

export class WixController {
  private service = new WixService();

  getByUserId = async (req: AuthedRequest) => {
    const { identification } = req;
    const result = await this.service.getByUserId(identification._id);
    return result;
  };

  update = async (req: AuthedExtendedRequest<UpdateWixData>) => {
    const { identification, body } = req;
    const result = await this.service.update(identification._id, body);
    return result;
  };
}
