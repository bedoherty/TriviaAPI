import * as express from "express";
import { getRandomQuestion, getQuestionsPage, getQuestionById } from "src/Data/Questions";
import { IQuestion } from "src/Interfaces/Questions";
import { checkJwt } from "src/Data/Auth";

const questionsRouter = express.Router();

questionsRouter.use(checkJwt)

questionsRouter.get("/random", (req, res) => {
    getRandomQuestion()
        .then((question: IQuestion) => {
            res.send(question);
        })
        .catch((err) => {
            res.sendStatus(500);
            res.send(err);
        });
});

questionsRouter.get("/list", (req, res) => {
    const { page: pageString, perPage: perPageString } = req.query;
    const page = Number.parseInt(pageString.toString());
    const perPage = Number.parseInt(perPageString.toString());

    getQuestionsPage(page, perPage).then((page: any) => {
        res.send(page);
    }).catch(console.log);
});

questionsRouter.get("/:questionId", (req, res) => {
    let id = req.params.questionId;
    getQuestionById(id).then((question: IQuestion) => {
        res.send(question);
    }).catch(console.log);
});

export default questionsRouter;
