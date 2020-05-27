import * as express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import questionsRouter from "src/Routes/Questions";
import { checkJwt } from "src/Data/Auth";

// Initialize our Express Application
const app = express();

// Enable CORS
app.use(cors());

// parse application/json
app.use(bodyParser.json())

app.get("/validate", checkJwt, (req, res) => {
    res.send({
        msg: "Your access token is valid"
    });
});

app.use("/questions", questionsRouter);

// Start our app
app.listen(3069, () => {
    console.log("API listening on port 3069");
});