import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private video_content!: string;
  baseApiUrl = 'http://localhost:5000/blur'
  constructor(private http:HttpClient) {
    this.video_content = '';
   }
  upload(file:File|any):Observable<any>{

    //create form data
    const formData = new FormData();
    //store form name as "file" with file data
    formData.append('file',file,file.name);
    // Make http post request over api
      // with formData as req
      return this.http.post(this.baseApiUrl, formData,{observe: 'response' ,responseType: 'arraybuffer'})

  }
  setOption(value: string) {  
      
    this.video_content = value;  
  }  
  
  getOption() {  
    return this.video_content;  
  } 
}
