const express = require('express');
const { engine } = require('express-handlebars');
const {todoListRouter} = require("./routes/todoList");
const {handleError} = require("./utils/errors");

const app = express();

app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use(express.static('public'))
app.use(express.json());

app.use('/todoList', todoListRouter);

app.get('/', (req, res) => {
    res.redirect('/todolist')
})

app.use(handleError);

app.listen(8000, '127.0.0.1', () => {
    console.log('Server is running on http://localhost:8000');
});
