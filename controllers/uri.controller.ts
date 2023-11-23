import { UriService } from "../services/uri.service";
import { UpdateUriData } from "../types/uri.types";
import { AuthedExtendedRequest, AuthedRequest } from "../types/request.types";

export class UriController {
  private service = new UriService();

  async getByUserId(req: AuthedRequest) {
    const { identification } = req;
    const result = await this.service.getByUserId(identification._id);
    return result;
  }

  async update(req: AuthedExtendedRequest<UpdateUriData>) {
    const { identification, body } = req;
    const { _id } = identification;
    const result = await this.service.update(_id, body);
    return result;
  }
}
