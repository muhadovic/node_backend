import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IProductComment } from '../interfaces/product-comment.interface';

@Injectable()
export class ProductCommentRepository {
  constructor(
    @InjectModel('ProductComment') private readonly ProductCommentModel: Model<IProductComment>,
  ) {
  }
  public async find(conditions: any = {}): Promise<IProductComment[]> {
    return this.ProductCommentModel.find(conditions, null, { sort: { created: -1 } });
  }

  public async findOne(conditions: any = {}, include: any = []): Promise<IProductComment> {
    return this.ProductCommentModel.findOne(conditions).populate(include);
  }

  public async create(userId: string, data: any): Promise<IProductComment> {
    return await this.ProductCommentModel.create({
      _id: Types.ObjectId(),
      created: new Date(),
      owner: userId,
      ...data
    });
  }

  public async updateOne(query: any, dataToUpdate: any): Promise<IProductComment> {
    await this.ProductCommentModel.findOneAndUpdate(query, dataToUpdate);
    return await this.ProductCommentModel.findOne(query);
  }

  public async deleteOne(conditions: any = {}) {
    return this.ProductCommentModel.deleteOne(conditions);
  }
}
