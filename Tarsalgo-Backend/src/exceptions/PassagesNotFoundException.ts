import HttpException from "./HttpException";

export default class RecipeNotFoundException extends HttpException {
    constructor(id: string) {
        super(404, `Passages with id ${id} not found`);
    }
}
