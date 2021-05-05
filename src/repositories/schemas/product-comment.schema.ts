import { Schema } from 'mongoose';
import { ProductCommentTypeEnum } from '../../enums/product-comment-type.enum';

export const ProductCommentSchema: Schema = new Schema({
  _id: Schema.Types.ObjectId,

  created: {
    type: Date,
    required: true,
    default: new Date(),
  },
  text: {
    type: String,
    required: true,
  },
  rateQuality: {
    type: Number,
    required: true,
  },
  ratePrice: {
    type: Number,
    required: true,
  },
  rateService: {
    type: Number,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  product: {
    type: String,
    required: true,
  },
  type: {
    type: ProductCommentTypeEnum,
    required: true,
  },
});
