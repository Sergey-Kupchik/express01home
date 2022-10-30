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
     return
})

videosRouter.get('/:id', (req: Request, res: Response) => {
    const searchResult = videos.find(v => v.id === +req.params.id);
    if (searchResult) {
          res.send(searchResult)
        return
    } else {
           res.sendStatus(404)
           return
    }
})

videosRouter.post('/', (req: Request, res: Response) => {
    const newTitle = req.body.title;
    if (newTitle && newTitle.toString().length<=40) {
        const newVideo: VideoType = {
            id: newId(),
            title: req.body.title,
            author: authorName(),
        }
        videos.push(newVideo);
          res.sendStatus(201).send(newVideo)
        return
    } else {
          res.sendStatus(400).send(errorResp)
          return
    }
})

videosRouter.put('/:id', (req: Request, res: Response) => {
    const searchResult = videos.find(v => v.id === +req.params.id);
    const newTitle = req.body.title
    if (searchResult ) {
        if (newTitle && newTitle.toString().length<=40) {
            searchResult.title = newTitle;
                res.sendStatus(204)
                return
        } else {
               res.status(400).send(errorResp)
               return
        }
    } else {
          res.sendStatus(404)
          return
    }
})

videosRouter.delete('/:id', (req: Request, res: Response) => {
    const searchId = +req.params.id;
        for (let i = 0; i < videos.length; i++) {
            if (videos[i].id === searchId) {
                videos.splice(i, 1)
                  res.sendStatus(204)
                  return
                
            }
        }
         res.sendStatus(404)
         return
})



type VideoType = {
    id: number
    title: string
    author: string
};
