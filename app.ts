import * as express from "express";
import {engine} from "express-handlebars";
import {homeRouter} from "./routes/home";
import {todoListRouter} from "./routes/todo-list";
import {handleError} from "./utils/errors";


const app = express();

app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use(express.static('./public'))
app.use(express.json());

app.use('/', homeRouter)
app.use('/todoList', todoListRouter);

app.get('/', (req, res) => {
    res.redirect('/todolist')
})

app.use(handleError);

app.listen(3000, '127.0.0.1', () => {
    console.log('Server is running on http://localhost:3000');
});
