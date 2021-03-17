import * as express from 'express';
import { getRepository } from 'typeorm';
import Controller from '../interfaces/controller.interface';
import Address from './address.entity';

class AddressController implements Controller {
  public path = '/addresses';

  public router = express.Router();

  private addressRepository = getRepository(Address);

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllAddresses);
  }

  private getAllAddresses = async (req: express.Request, res: express.Response) => {
    const addresses = await this.addressRepository.find({ relations: ['user'] });
    res.send(addresses);
  };
}

export default AddressController;
