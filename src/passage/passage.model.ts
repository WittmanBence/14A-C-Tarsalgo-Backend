// https://mongoosejs.com/docs/validation.html

import { Schema, model } from "mongoose";
import IPassages from "./passage.interface";

const passagesSchema = new Schema<IPassages>(
    {
        _id: Number,
        hour: {
            type: Number,
        },
        min: {
            type: Number,
        },
        direction: {
            type: String,
        },
        FK: {
            type: Number,
            ref: "people",
        },
    },
    { versionKey: false },
);

const passagesModel = model<IPassages>("passages", passagesSchema);

export default passagesModel;
