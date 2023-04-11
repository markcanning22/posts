import express, {Request, Response} from 'express';
import { randomBytes } from 'crypto';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts: {[index: string]: {}} = {};

app.get('/posts', (req: Request, res: Response): void => {
    res.send(posts);
});

app.post('/posts', async (req: Request, res: Response): Promise<void> => {
    const id: string = randomBytes(4).toString('hex');
    const { title } = req.body;

    posts[id] = {
        id, title
    };

    await axios.post('http://event-bus-srv:4005/events', {
        type: 'PostCreated',
        data: {
            id,
            title
        }
    });

    res.status(201).send(posts[id]);
});

app.post('/events', (req: Request, res: Response): void => {
    console.log('Received event', req.body.type);

    res.send({});
});

app.listen(4000, (): void => {
    console.log('Listening on 4000');
});