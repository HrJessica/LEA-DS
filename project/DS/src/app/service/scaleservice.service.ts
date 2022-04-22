import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Data } from '@angular/router';
import { map,catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ScaleserviceService {
  public fileContent!: string;
  constructor(private http:HttpClient) { 
  
  }
  server_address = "http://localhost:5000/scaling";
  
  send_post_request(data:Data){
    return this.http.post(this.server_address,JSON.stringify(data),{observe: 'response',responseType: 'json'})
                 
                    
  }
  setOption(value: string) {  
      
    this.fileContent = value;  
  }  
  
  getOption() {  
    return this.fileContent;  
  } 
}
