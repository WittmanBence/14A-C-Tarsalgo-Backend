import App from "./app";
import AuthenticationController from "./authentication/authentication.controller";
import UserController from "./user/user.controller";
import PassageController from "./passage/passage.controller";
import PeopleController from "./people/people.controller";

const app = new App([new AuthenticationController(), new UserController(), new PeopleController(), new PassageController()]);

app.listen();
