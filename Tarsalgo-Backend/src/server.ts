import App from "./app";
import AuthenticationController from "./authentication/authentication.controller";
import PostController from "./people/people.controller";
import ReportController from "./report/report.controller";
import UserController from "./user/user.controller";
import PassageController from "./passage/passage.controller";

const app = new App([new PostController(), new AuthenticationController(), new UserController(), new ReportController(), new PassageController()]);

app.listen();
