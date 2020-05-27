import { MongoClient, Db, ObjectId, CollectionAggregationOptions, InsertOneWriteOpResult } from "mongodb";
import { IQuestion } from "src/Interfaces/Questions";

// Helper function for DB access
const executeDB = (callback: (db:  Db) => void) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect("mongodb://localhost:27017", (err, client) => {
            if (err) {
                console.log(err);
                reject(err);
            }

            resolve(callback(client.db("develop")));
            client.close();
        });
    });
}

export const getRandomQuestion = () => {
    return new Promise((resolve, reject) => {
        executeDB((db: Db) => { 
            db.collection("questions").aggregate([
                {
                    $sample: {
                        size: 1
                    }
                }
            ])
            .toArray()
            .then((values: IQuestion[]) => {
                if (values && values.length > 0) {
                    resolve(values[0]);
                }
                reject();
            })
            .catch(reject);
        });
    });
}

export const getQuestionsPage = (page: number = 1, perPage: number = 10, search?: string) => {
    return new Promise((resolve, reject) => {
        const questionsFacets: Object[] = [
            { $skip: (page - 1) * perPage }, // Skip pages we have already traversed
            { $limit: perPage } // Limit to our per page amount
        ];

        executeDB((db: Db) => {
            db
                .collection("questions").aggregate(
                    [
                        {
                            $match: {
                                $text: {
                                    $search: search
                                }
                            }
                        },
                        {
                            $addFields: {
                                score: {
                                    $meta: "textScore"
                                }
                            }
                        },
                        {
                            $facet: {
                                questions: questionsFacets,
                                totalQuestions:  [
                                    {
                                        $count: "count"
                                    }
                                ]
                            }
                        }
                    ]
                )
                .toArray()
                .then((data: any) => {
                    const lastPage = Math.ceil(data?.[0]?.totalQuestions?.[0]?.count / perPage);

                    let pageData = {
                        data: data[0].questions,
                        pagination: {
                            currentPage: page,
                            nextPage: page + 1,
                            lastPage
                        }
                    };

                    if (page >= lastPage) {
                        delete pageData.pagination.nextPage;
                    }

                    resolve(pageData);
                })
                .catch(reject);
        });
    });
}

export const getQuestionById = (questionId: string) => {
    return new Promise((resolve, reject) => {
        executeDB((db: Db) => {
            db
                .collection("questions")
                .findOne({
                    _id: new ObjectId(questionId)
                })
                .then(resolve)
                .catch(reject);
        });
    })
}

export const updateQuestion = (question: IQuestion) => {
    const { _id, ...updatedQuestion } = question;

    return new Promise((resolve, reject) => {
        executeDB((db: Db) => {
            db
                .collection("questions")
                .updateOne(
                    {
                        _id: new ObjectId(_id)
                    },
                    {
                        $set: updatedQuestion
                    }
                )
                .then(resolve)
                .catch(reject);
        });
    });
}

export const createQuestion = (question: IQuestion) => {
    return new Promise((resolve, reject) => {
        executeDB((db: Db) => {
            db
                .collection("questions")
                .insertOne(question)
                .then((val: InsertOneWriteOpResult<IQuestion>) => {
                    resolve(val.insertedId.toHexString());
                })
                .catch(reject);
        })
    })
}