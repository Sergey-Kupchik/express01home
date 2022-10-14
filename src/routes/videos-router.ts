import {Request, Response, Router} from 'express';

export const videosRouter = Router();

const errorResp = {
    errorsMessages: [
        {
            message: "Body and title are required",
            field: "title"
        }
    ]
};

const videos: VideoType[] = [
    {id: 1, title: "My video", author: "Imagine Dragons"},
    {id: 2, title: "Concert", author: "Home Depot"},
    {id: 3, title: "DIY", author: "Alex"},
];

const authorName = (): string => (Math.random() + 1).toString(36).substring(7);

export const newId = (): number => +(new Date());

videosRouter.get('/', (req: Request, res: Response) => {
    res.send(videos)
})

videosRouter.get('/:id', (req: Request, res: Response) => {
    const searchResult = videos.find(v => v.id === +req.params.id);
    if (searchResult) {
        res.send(searchResult)
    } else {
        res.send(404)
    }
})

videosRouter.post('/', (req: Request, res: Response) => {
    const newTitle = req.body.title;
    if (newTitle) {
        const newVideo: VideoType = {
            id: newId(),
            title: req.body.title,
            author: authorName(),
        }
        videos.push(newVideo);
        res.status(201).send(newVideo)
    } else {
        res.status(400).send(errorResp)
    }
})

videosRouter.put('/:id', (req: Request, res: Response) => {
    const searchResult = videos.find(v => v.id === +req.params.id);
    const newTitle = req.body.title
    if (searchResult) {
        if (newTitle) {
            searchResult.title = newTitle;
            res.send(204)
        } else {
            res.status(400).send(errorResp)
        }
    } else {
        res.send(404)
    }
})

videosRouter.delete('/:id', (req: Request, res: Response) => {
    const searchId = +req.params.id;
    if (searchId) {
        for (let i = 0; i < videos.length; i++) {
            if (videos[i].id === searchId) {
                videos.splice(i, 1)
                res.send(204)
                return
            } else {
                res.send(404)
            }
        }
    } else {
        res.send(404)
    }
})



type VideoType = {
    id: number
    title: string
    author: string
};
