import { Schema } from 'mongoose';
import { ProductConditionsEnum } from '../../enums/product-condirions.enum';
import { ProductStatusEnum } from '../../enums/product-status.enum';

export const ProductSchema: Schema = new Schema({
  _id: Schema.Types.ObjectId,

  created: {
    type: Date,
    required: true,
    default: new Date(),
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  quantitySold: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  condition: {
    type: ProductConditionsEnum,
    required: true,
  },
  status: {
    type: ProductStatusEnum,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    required: false,
  },
  files: {
    type: Array,
    required: false,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  subCategory: {
    type: Schema.Types.ObjectId,
    ref: 'SubCategory',
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  weight: {
    type: Number,
    required: true,
  },
  feePrice: {
    type: Number,
    required: true,
  },
  country_code: {
    type: String,
    required: false,
  },
  state_code: {
    type: String,
    required: false,
  },
  favorites: {
    type: Array,
    required: false
  },
});
