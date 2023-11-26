import {Auth} from "../auth/Auth";
import mongoose from "mongoose";

export interface User extends mongoose.Document {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    auth: Auth,
    onBoardingDone: boolean
}

export const UserSchema = new mongoose.Schema<User>({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: false
    },
    auth: {
        password: {
            type: String,
            required: true,
            select: false
        },
        salt: {
            type: String,
            select: false
        },
        sessionToken: {
            type: String,
            select: false
        }
    },
    onBoardingDone: {
        type: Boolean,
        default: false
    }
})

export const UserModel = mongoose.model<User>('User', UserSchema)

export interface CreateUser{
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    password: string;
}