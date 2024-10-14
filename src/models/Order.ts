import { Schema, model, Types } from 'mongoose';

interface IOrder {
  user: Types.ObjectId;
  date: Date;
  totalPrice: number;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  products: Types.ObjectId[];
}

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: {
      type: Date,
      required: [true, 'Order must have a date'],
      validate: {
        validator: (value: Date) => value <= new Date(),
        message: 'Order date must be in the past or present',
      },
    },
    totalPrice: {
      type: Number,
      required: [true, 'Order must have a total price'],
      min: [0, 'Total price must be above 0'],
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: [true, 'Location type is required'],
      },
      coordinates: {
        type: [Number],
        required: [true, 'Coordinates are required'],
        validate: {
          validator: function (val: number[]) {
            return val.length === 2;
          },
          message:
            'Coordinates must have exactly 2 values (longitude and latitude)',
        },
      },
    },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
);

OrderSchema.index({ location: '2dsphere' });

const Order = model<IOrder>('Order', OrderSchema);

export { Order, IOrder };
