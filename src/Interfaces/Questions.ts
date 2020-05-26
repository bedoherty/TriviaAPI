import { ObjectId } from "mongodb";

export interface IQuestion {
    _id: ObjectId;
    prompt: string;
    answers: string[];
}