const express = require("express");
const app = express();
const fs = require("fs");
const QuizzController = require("./controllers/QuizzController");
const UserController = require("./controllers/UserController");
const session = require("express-session");

app.set("view engine", "ejs");

app.use(
  session({
    secret: "agrotools",
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  var quizzes = [];
  fs.readdir("./data/question_list", (err, files) => {
    files.reverse().forEach((file, i) => {
      fs.readFile("./data/question_list/" + file, (err, content) => {
        var fileContent = JSON.parse(content);
        quizzes.push({ title: fileContent.titulo, id: file });
        if (i == files.length - 1) {
          res.render("index", { user: req.session.user, quizzes: quizzes });
        }
      });
    });
  });
});

app.use(QuizzController);
app.use(UserController);

app.listen(8080, () => {
  console.log("Servidor rodando");
});
