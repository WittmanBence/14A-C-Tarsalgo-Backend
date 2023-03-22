import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import IPassages from "./passage.interface";

export default class CreatePassagesDto implements IPassages {
    @IsNotEmpty()
    @IsNumber()
    _id: number;

    @IsNotEmpty()
    @IsNumber()
    hour: number;

    @IsNotEmpty()
    @IsNumber()
    min: number;

    @IsNotEmpty()
    @IsString()
    direction: string;

    @IsNotEmpty()
    @IsNumber()
    FK: number;
}
