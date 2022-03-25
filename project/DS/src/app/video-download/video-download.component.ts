import { Component } from '@angular/core';
import { FileUploadService } from '../service/file-upload.service';
import { saveAs} from 'file-saver';
import { map } from 'rxjs';
@Component({
  selector: 'app-video-download',
  templateUrl: './video-download.component.html',
  styleUrls: ['./video-download.component.css']
})
export class VideoDownloadComponent {
  public data!:string;
	constructor(private Data: FileUploadService ) {
		this.data = Data.getOption()
	}
	


  download() {
			
    const video = this.data
    
    var blob = new Blob([video], {type: 'video/mp4' })
    saveAs(blob, "Blured.mp4");
}
}
