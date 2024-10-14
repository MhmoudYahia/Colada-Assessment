import { Schema, model, Document } from 'mongoose';
import { emailRegex } from '../common';

interface IUser  {
  name: string;
  email: string;
}

const userSchema = new Schema<IUser>(
  {
    name: { 
      type: String, 
      required: [true, 'A user must have a name'], 
      minlength: [3, 'A user name must have more or equal than 3 characters'], 
      maxlength: [50, 'A user name must have less or equal than 50 characters'],
      validate: {
        validator: function (val: string) {
          return /^[a-zA-Z\s]+$/.test(val); // Only letters and spaces
        },
        message: 'User name must contain only letters and spaces',
      },
    },
    email: {
      type: String,
      required: [true, 'A user must have an email'],
      unique: true,
      validate: {
        validator: (v: string) => emailRegex.test(v),
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });

const User = model<IUser>('User', userSchema);

export { User, IUser };