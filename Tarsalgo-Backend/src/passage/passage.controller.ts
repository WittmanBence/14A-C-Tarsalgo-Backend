import { NextFunction, Request, Response, Router } from "express";

import IController from "../interfaces/controller.interface";
import CreatePassageDto from "./passage.dto";
import HttpException from "../exceptions/HttpException";
import IdNotValidException from "../exceptions/IdNotValidException";
import IPassage from "./passage.interface";
import PassagesNotFoundException from "../exceptions/PassagesNotFoundException";
import IRequestWithUser from "../interfaces/requestWithUser.interface";
import { Types } from "mongoose";
import authMiddleware from "../middleware/auth.middleware";
import PassageModel from "./passage.model";
import validationMiddleware from "../middleware/validation.middleware";

export default class PassageController implements IController {
    public path = "/Passages";
    public router = Router();
    private PassageM = PassageModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, authMiddleware, this.getAllPassages);
        this.router.get(`${this.path}/:id`, authMiddleware, this.getPassageById);
        this.router.get(`${this.path}/:offset/:limit/:order/:sort/:keyword?`, authMiddleware, this.getPaginatedPassages);
        this.router.patch(`${this.path}/:id`, [authMiddleware, validationMiddleware(CreatePassageDto, true)], this.modifyPassage);
        this.router.delete(`${this.path}/:id`, authMiddleware, this.deletePassages);
        this.router.post(this.path, [authMiddleware, validationMiddleware(CreatePassageDto)], this.createPassage);
    }

    private getAllPassages = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const count = await this.PassageM.countDocuments();
            const passages = await this.PassageM.find();
            res.send({ count: count, passages: passages });
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private getPaginatedPassages = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const offset = parseInt(req.params.offset);
            const limit = parseInt(req.params.limit);
            const order = req.params.order;
            const sort = parseInt(req.params.sort); // desc: -1  asc: 1
            let passages = [];
            let count = 0;
            if (req.params.keyword) {
                const myRegex = new RegExp(req.params.keyword, "i"); // i for case insensitive
                count = await this.PassageM.find({ $or: [{ PassageName: myRegex }, { description: myRegex }] }).count();
                passages = await this.PassageM.find({ $or: [{ PassageName: myRegex }, { description: myRegex }] })
                    .sort(`${sort == -1 ? "-" : ""}${order}`)
                    .skip(offset)
                    .limit(limit);
            } else {
                count = await this.PassageM.countDocuments();
                passages = await this.PassageM.find({})
                    .sort(`${sort == -1 ? "-" : ""}${order}`)
                    .skip(offset)
                    .limit(limit);
            }
            res.send({ count: count, passages: passages });
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private getPassageById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            if (Types.ObjectId.isValid(id)) {
                const passage = await this.PassageM.findById(id).populate("people");
                if (passage) {
                    res.send(passage);
                } else {
                    next(new PassagesNotFoundException(id));
                }
            } else {
                next(new IdNotValidException(id));
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private modifyPassage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            if (Types.ObjectId.isValid(id)) {
                const passageData: IPassage = req.body;
                const passage = await this.PassageM.findByIdAndUpdate(id, passageData, { new: true });
                if (passage) {
                    res.send(passage);
                } else {
                    next(new PassagesNotFoundException(id));
                }
            } else {
                next(new IdNotValidException(id));
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private createPassage = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
        try {
            const passageData: IPassage = req.body;
            const createdPassage = new this.PassageM({ passageData });
            const savedPassage = await createdPassage.save();
            await savedPassage.populate("People");
            res.send(savedPassage);
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private deletePassages = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            if (Types.ObjectId.isValid(id)) {
                const successResponse = await this.PassageM.findByIdAndDelete(id);
                if (successResponse) {
                    res.sendStatus(200);
                } else {
                    next(new PassagesNotFoundException(id));
                }
            } else {
                next(new IdNotValidException(id));
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };
}
