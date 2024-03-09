import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    familyName: String,
    surename: String,
    givenName: String,
    sex: String,
    dateOfBirth: String,
    registrationNumber: String,
    userImage: String,
    ciImage: String,
    ciData: String,
    registrationNumberReq: String

});

export interface User extends mongoose.Document {
    familyName: string;
    surename: string;
    givenName: string;
    sex: string;
    dateOfBirth: string;
    registrationNumber: string;
    userImage: string;
    ciImage: string;
    ciData: string;
    registrationNumberReq: string;
}
