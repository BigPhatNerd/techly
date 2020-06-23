const express = require('express');
const routes = require('./controllers');
//Require the routes within your api folder. 
const apiRoutes = require(./controllers/api)
const sequelize = require('./config/connection');
const path = require('path');

// helper function
const helpers = require('./utils/helpers');

// handlebars
const exphbs = require('express-handlebars');
const hbs = exphbs.create({helpers});

// session (connects session to sequelize Database) --> authentication 
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3001;

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
  secret: 'project2 super secret',
  cookie: { maxAge: 60000},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// turn on routes
app.use(routes);
//Make sure Express knows that these routes are here as well. (Might need to play with the naming convention, but I think this will do.)
app.use(apiRoutes);

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {    // true will recrete the tables, set back to false after creating
  app.listen(PORT, () => console.log('Now listening'));
});
