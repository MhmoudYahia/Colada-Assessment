import { Schema, model, Document } from 'mongoose';

interface IProduct {
  name: string;
  category: string;
  price: number;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'A product must have a name'],
      minlength: [
        3,
        'A product name must have more or equal than 3 characters',
      ],
      maxlength: [
        50,
        'A product name must have less or equal than 50 characters',
      ],
      validate: {
        validator: function (val: string) {
          return /^[a-zA-Z\s]+$/.test(val); // Only letters and spaces
        },
        message: 'Product name must contain only letters and spaces',
      },
    },
    category: {
      type: String,
      required: false,
      minlength: [
        3,
        'A product category must have more or equal than 3 characters',
      ],
      maxlength: [
        50,
        'A product category must have less or equal than 50 characters',
      ],
      validate: {
        validator: function (val: string) {
          return /^[a-zA-Z\s]+$/.test(val); // Only letters and spaces
        },
        message: 'Product category must contain only letters and spaces',
      },
    },
    price: {
      type: Number,
      required: [true, 'A product must have a price'],
      min: [0, 'Price must be above 0'],
    },
  },
  { timestamps: true }
);

const Product = model<IProduct>('Product', productSchema);

export { Product, IProduct };
