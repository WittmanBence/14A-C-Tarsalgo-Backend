import HttpException from "./HttpException";

export default class PostNotFoundException extends HttpException {
    constructor(id: string) {
        super(404, `People with id ${id} not found`);
    }
}
