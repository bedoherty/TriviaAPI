import * as express from "express";
import { getRandomQuestion, getQuestionsPage, getQuestionById, updateQuestion, createQuestion } from "src/Data/Questions";
import { IQuestion } from "src/Interfaces/Questions";
import { checkJwt } from "src/Data/Auth";
import { ObjectId } from "mongodb";

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
    const { page: pageString, perPage: perPageString, search: searchString } = req.query;
    const page = Number.parseInt(pageString.toString());
    const perPage = Number.parseInt(perPageString.toString());
    const search = searchString?.toString();

    getQuestionsPage(page, perPage, search).then((page: any) => {
        res.send(page);
    }).catch(console.log);
});

questionsRouter.get("/:questionId", (req, res) => {
    let id = req.params.questionId;
    getQuestionById(id).then((question: IQuestion) => {
        res.send(question);
    }).catch(console.log);
});

questionsRouter.post("/:questionId", (req, res) => {
    updateQuestion(req?.body).then(() => {
        res.send(req?.body);
    }).catch(console.log);
});

questionsRouter.put("", (req, res) => {
    createQuestion(req?.body).then((_id: string) => {
        res.send({
            ...req?.body,
            _id
        })
    }).catch(console.log);
});

export default questionsRouter;
