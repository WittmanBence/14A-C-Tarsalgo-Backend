import { Schema, model } from "mongoose";
import IPeople from "./people.interface";

const peopleSchema = new Schema(
    {
        _id: Number,
        name: {
            type: String,
            required: true,
        },
    },
    { versionKey: false },
);

const peopleModel = model<IPeople>("people", peopleSchema);

export default peopleModel;
