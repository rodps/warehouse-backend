"use strict";

// dependencias
var express            = require("express"),
    bodyParser         = require("body-parser"),
    passport           = require("passport"),
    session            = require("express-session"),
    db                 = require("./models"),
    passportStrategies = require("./config/passport")(db.usuarios),
    methodOverride     = require("method-override"),
    cors               = require('cors'),
    moment             = require('moment'),
    app                = express();

// routers
var loginRouter        = require("./routes/login"),
    solicitacoesRouter = require("./routes/solicitacoes"),
    produtosRouter     = require("./routes/produtos"),
    requisicoesRouter  = require("./routes/requisicoes"),
    orcamentosRouter   = require("./routes/orcamentos"),
    estoqueRouter      = require("./routes/estoque");

// configuracoes
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(cors());
moment.locale('pt-br');

//passport config
// app.use(
//   session({
//     secret: "keyboard cat",
//     resave: true,
//     saveUninitialized: true
//   })
// );
app.use(passport.initialize());
// app.use(passport.session()); // persistent login sessions
passport.use("local-signup", passportStrategies.localSignup);
passport.use("local-signin", passportStrategies.localSignin);
passport.serializeUser(passportStrategies.serialize);
passport.deserializeUser(passportStrategies.deserialize);

//rotas
app.use("/", loginRouter);
app.use("/solicitacoes", solicitacoesRouter);
app.use("/produtos", produtosRouter);
app.use("/requisicoes", requisicoesRouter);
app.use("/orcamentos", orcamentosRouter);
app.use("/estoque", estoqueRouter);

/**
 *  Inicializa o banco de dados
 *  sync({force:true}) Drop tables if exists
 */
db.sequelize.sync({force:true}).then(() => {
  console.log("Nice! Database looks fine");
}).catch(function (err) {
  console.log(err, "Algo deu errado com a database!");
});

module.exports = app.listen(3001, function (err) {
  if (!err) console.log("The server has started!");
  else console.log(err);
});