
export class Video {
    shortLink: string;
    loading: boolean;
    file: File|null
    constructor(shortLink: string,loading: boolean,file:File|null){
        this.shortLink=shortLink;
        this.loading=loading;
        this.file = file;
        
    }
    
}