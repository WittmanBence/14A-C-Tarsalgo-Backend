import { Router, Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import PeopleNotFoundException from "../exceptions/PeopleNotFoundException";
import IdNotValidException from "../exceptions/IdNotValidException";
import HttpException from "../exceptions/HttpException";
import IController from "../interfaces/controller.interface";
import IRequestWithUser from "../interfaces/requestWithUser.interface";
import validationMiddleware from "../middleware/validation.middleware";
import CreatePeopleDto from "./people.dto";
import IPeople from "./people.interface";
import PeopleModel from "./people.model";

export default class PeopleController implements IController {
    public path = "/Peoples";
    public router = Router();
    private People = PeopleModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllPeoples);
        this.router.get(`${this.path}/:id`, this.getPeopleById);
        this.router.patch(`${this.path}/:id`, [validationMiddleware(CreatePeopleDto, true)], this.modifyPeople);
        this.router.delete(`${this.path}/:id`, this.deletePeople);
        this.router.post(this.path, [validationMiddleware(CreatePeopleDto)], this.createPeople);
    }

    private getAllPeoples = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const Peoples = await this.People.find();
            res.send({ Peoples: Peoples });
        } catch (error) {
            next(new HttpException(500, error.message));
        }
    };

    private getPeopleById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            if (Types.ObjectId.isValid(id)) {
                const people = await PeopleModel.findById(id);
                if (people) {
                    res.send(people);
                } else {
                    next(new PeopleNotFoundException(id));
                }
            } else {
                next(new IdNotValidException(id));
            }
        } catch (error) {
            next(new HttpException(500, error.message));
        }
    };

    private modifyPeople = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            if (Types.ObjectId.isValid(id)) {
                const peopleData: IPeople = req.body;
                const people = await this.People.findByIdAndUpdate(id, peopleData, { new: true });
                if (people) {
                    res.send(people);
                } else {
                    next(new PeopleNotFoundException(id));
                }
            } else {
                next(new IdNotValidException(id));
            }
        } catch (error) {
            next(new HttpException(500, error.message));
        }
    };

    private createPeople = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
        try {
            const peopleData: IPeople = req.body;
            const createdPeople = new PeopleModel({
                ...peopleData,
            });
            const savedPeople = await createdPeople.save();
            res.send({ People: savedPeople });
            res.send(savedPeople);
        } catch (error) {
            next(new HttpException(500, error.message));
        }
    };

    private deletePeople = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            if (Types.ObjectId.isValid(id)) {
                const successResponse = await PeopleModel.findByIdAndDelete(id);
                if (successResponse) {
                    res.sendStatus(200);
                } else {
                    next(new PeopleNotFoundException(id));
                }
            } else {
                next(new IdNotValidException(id));
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };
}
