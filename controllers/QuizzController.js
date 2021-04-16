const express = require("express");
const router = express.Router();
const Quizz = require("../models/Quizz");
const Answer = require("../models/Answer");
const fs = require("fs");
const dateFormat = require("dateformat");

router.get("/quizz/create", (req, res) => {
  if (!req.session.user) {
    res.redirect("/");
  }
  res.render("quizz/create", { user: req.session.user });
});

router.post("/quizz/create/confirm", (req, res) => {
  const length = fs.readdirSync("./data/question_list").length + 1;
  const quizz = new Quizz(
    req.body.title,
    req.session.user.username,
    dateFormat(new Date(), "yyyy-mm-dd h:MM:ss"),
    req.body.questions
  );
  fs.writeFile("./data/question_list/" + length, JSON.stringify(quizz), () => {
    res.redirect("/");
  });
});

router.get("/quizz/:id", (req, res) => {
  const id = req.params.id;
  var userAnswer = [];
  fs.readFile("./data/question_list/" + id, (err, content) => {
    const fileContent = JSON.parse(content);
    if (req.session.user) {
      fs.readFile(
        "./data/user_list/" + req.session.user.username + "/" + id,
        (err, answer) => {
          if (!err) {
            userAnswer = JSON.parse(answer).answers;
          }
          res.render("quizz/quizz", {
            user: req.session.user,
            id: id,
            title: fileContent.titulo,
            questions: fileContent.questions,
            answers: userAnswer,
          });
        }
      );
    } else {
      res.render("quizz/quizz", {
        user: req.session.user,
        id: id,
        title: fileContent.titulo,
        questions: fileContent.questions,
        answers: userAnswer,
      });
    }
  });
});

router.post("/quizz/:id/answer", (req, res) => {
  const id = req.params.id;
  const answer = new Answer(
    req.body.answers,
    dateFormat(new Date(), "yyyy-mm-dd h:MM:ss"),
    req.body.lat,
    req.body.long
  );
  fs.writeFile(
    ("./data/user_list/" + req.session.user.username + "/" + id).replace(
      /\s/g,
      ""
    ),
    JSON.stringify(answer),
    () => {
      res.redirect("/");
    }
  );
});

module.exports = router;
