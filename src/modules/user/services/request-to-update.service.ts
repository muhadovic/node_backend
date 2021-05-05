import { Injectable } from '@nestjs/common';
import { RequestToUpdateRepository } from '../../../repositories/request-to-update.repository';
import { IRequestToUpdate } from '../../../interfaces/request-to-update.interface';
import { RequestToUpdateStatusEnum } from '../../../enums/request-to-update-status.enum';
import { UserService } from './user.service';
import { MarketShopService } from '../../market/services/market-shop.service';
import { UserRoleEnum } from '../../../enums/user-role.enum';

@Injectable()
export class RequestToUpdateService {
  constructor(
    private readonly requestToUpdateRepository: RequestToUpdateRepository,
    private readonly userService: UserService,
    private readonly marketShopService: MarketShopService,
  ) {
  }

  public async getAll(data: any = {}): Promise<IRequestToUpdate[]> {
    return this.requestToUpdateRepository.find(data);
  }

  public async getById(id: IRequestToUpdate['_id']): Promise<IRequestToUpdate> {
    return this.requestToUpdateRepository.findOne({ _id: id });
  }

  public async update(requestToUpdateId: string, status: number): Promise<IRequestToUpdate> {
    const requestToUpdate = await this.getById(requestToUpdateId);
    if (status === RequestToUpdateStatusEnum.accept) {
      await this.userService.updateRole(requestToUpdate.user, UserRoleEnum.shopManager);
      await this.marketShopService.create({
        country: requestToUpdate.country,
        city: requestToUpdate.city,
        state: requestToUpdate.state,
        state_code: requestToUpdate.state_code,
        country_code: requestToUpdate.country_code,
        zipCode: requestToUpdate.zipCode,
        address: requestToUpdate.address,
        owner: requestToUpdate.user
      })
    }
    return this.requestToUpdateRepository.updateOne({ _id: requestToUpdateId }, { status: status });
  }

  public async create(userId: string, data: any): Promise<IRequestToUpdate> {
    return this.requestToUpdateRepository.create({
      user: userId,
      ...data
    });
  }

  public async delete(query: any): Promise<any> {
    if (!Object.keys(query).length) {
      throw new Error(`Empty query in findOne`);
    }
    await this.requestToUpdateRepository.deleteOne(query);
    return {
      message: 'success'
    }
  }
}
