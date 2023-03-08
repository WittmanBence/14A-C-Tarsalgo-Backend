import { Schema, model } from "mongoose";
import { string } from "yargs";
import IPeople from "./people.interface";

const peopleSchema = new Schema(
    {
        _id: Number,
        name: {
            type: string,
            required: true,
        },
    },
    { versionKey: false },
);

const peopleModel = model<IPeople>("people", peopleSchema);

export default peopleModel;
