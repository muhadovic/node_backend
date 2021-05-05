import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { CardRepository } from '../../../repositories/card.repository';
import { ICard } from '../../../interfaces/card.interface';
import { UserService } from './user.service';

@Injectable()
export class CardService {
  constructor(
    private readonly cardRepository: CardRepository,
  ) {
  }

  public async find(query: any): Promise<ICard[]> {
    return this.cardRepository.find(query);
  }

  public async getById(id: ICard['_id']): Promise<ICard> {
    return this.cardRepository.findOne({ _id: id });
  }

  public async findOne(userId: string, data: any): Promise<any> {
    const cart: any = await this.cardRepository.findOne(data);
  }

  public async update(data: any, dataToUpdate: any): Promise<ICard> {
    return this.cardRepository.updateOne(data, dataToUpdate);
  }

  public async create(userId: string, card: any): Promise<ICard> {
    await this.cardRepository.create({
      user: userId,
      card: card
    });
    return card
  }

  public async delete(query: any): Promise<any> {
    if (!Object.keys(query).length) {
      throw new Error(`Empty query in deleteOne`);
    }
    await this.cardRepository.deleteOne(query);
    return {
      message: 'success'
    }
  }
}
