/* eslint-disable @typescript-eslint/no-unused-vars */
import { IsInt, IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";

import IPeople from "./people.interface";

export default class CreatePeopleDto implements IPeople {
    @IsNotEmpty()
    @IsInt()
    public _id: number;

    @IsNotEmpty()
    @IsString()
    public name: string;
}
