const express = require('express');
const path = require('path');
const productsController = require('./controllers/Products');
const xaproductsController = require('./controllers/ProductsXATransaction');
const orm = require('./util/orm');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded());
app.use(express.json());

app.use("/products", productsController);
app.use("/xa", xaproductsController);

app.get("/home", (req, res) => {
    return res.status(200).render("home");
});

app.use("/*", (req, res) => {
    console.info(`404: ${req.originalUrl}`);
    return res.status(404).render('errors/404', {
        message: req.originalUrl
    });
});

orm.sync()
   .then(result => {
    app.listen(8080, () => console.log('Server listening on port: ', 8080));
   })
   .catch(error => {
       console.error(error);
   })



module.exports = app;
