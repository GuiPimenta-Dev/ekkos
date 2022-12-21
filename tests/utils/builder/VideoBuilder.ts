import VideoRepositoryInterface from '../../../src/domain/infra/repository/VideoRepositoryInterface';
import CommentDTO from '../../../src/dto/CommentDTO';
import { v4 as uuid } from "uuid";
import Video from '../../../src/domain/entity/Video';

export default class VideoBuilder {

    public videoId: string;
    public profileId: string;
    public title: string;
    public description: string;
    public url: string;
    public likes: string[];
    public comments: CommentDTO[];

    constructor(private videoRepository: VideoRepositoryInterface) {}

    createVideo(profileId: string) {
        this.videoId = uuid();
        this.profileId = profileId;
        this.title = "title";
        this.description = "description";
        this.url = "url";
        this.likes = [];
        this.comments = [];
        this.videoRepository.save(this.video);
        return this
    }

    withLike(like: string) {
        this.likes.push(like);
        this.videoRepository.update(this.video);
        return this
    }

    withComment(comment: CommentDTO) {
        this.comments.push(comment);
        this.videoRepository.update(this.video);
        return this
    }

    private get video() {
        return new Video(this.videoId, this.profileId, this.title, this.description, this.url, this.likes, this.comments);
    }

}