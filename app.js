"use strict";

const express = require("express"),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  session = require("express-session"),
  models = require("./models"),
  middleware = require("./middleware"),
  passportStrategies = require("./config/passport")(models.usuarios),
  moment = require("moment"),
  methodOverride = require("method-override"),
  app = express();

const  loginRouter = require("./routes/login"),
  solicitacoesRouter = require("./routes/solicitacoes"),
  produtosRouter = require("./routes/produtos"),
  requisicoesRouter = require("./routes/requisicoes");

// configuracoes
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//passport config
app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
passport.use("local-signup", passportStrategies.localSignup);
passport.use("local-signin", passportStrategies.localSignin);
passport.serializeUser(passportStrategies.serialize);
passport.deserializeUser(passportStrategies.deserialize);

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

//rotas
app.use("/", loginRouter);
app.use("/solicitacoes", solicitacoesRouter);
app.use("/produtos", produtosRouter);
app.use("/requisicoes", requisicoesRouter);

//Cria o banco de dados
//{force:true} Drop tables se ja existirem
models.sequelize
  .sync()
  .then(() => {
    console.log("Nice! Database looks fine");
    app.listen(3000, function(err) {
      if (!err) console.log("The server has started!");
      else console.log(err);
    });
  })
  .catch(function(err) {
    console.log(err, "Algo deu errado com a database!");
  });

app.get("/backend/solicitacoes/:id/orcamentos", (req, res) => {
  models.orcamentos
    .findAll({
      where: { solicitacao_id: req.params.id }
    })
    .then(orcamentos => {
      res.send(JSON.stringify(orcamentos));
    });
});

