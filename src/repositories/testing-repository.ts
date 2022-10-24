import {posts, PostType} from "./posts-repository";
import {blogs} from "./blogs-repository";
const testingRepository = {
    deleteAllRepositoriesData ():true {
        posts.splice(0, posts.length);
        blogs.splice(0, blogs.length);
        return true
    }

}

export {testingRepository, PostType}