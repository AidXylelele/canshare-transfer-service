import { MessageService } from "../services/message.service";
import { CenshareNotification } from "../types/external/asset.types";
import { AuthedExtendedRequest, AuthedRequest } from "../types/request.types";

export class MessageController {
  private service = new MessageService();

  processChangesNotification = async (req: AuthedExtendedRequest<CenshareNotification>) => {
    const { identification, body } = req;
    const user_id = identification._id;
    await this.service.notificationAboutChanges(user_id, body);
  };

  synchronize = async (req: AuthedRequest) => {
    const user_id = req.identification._id;
    await this.service.synchronization(user_id);
  };
}
