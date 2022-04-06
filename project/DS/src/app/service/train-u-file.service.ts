import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TrainUFileService {
  pkl_value!: string[];
  
  constructor(private http:HttpClient) {
   
   }
   uploads(APIUrl: string,files_1: ArrayBuffer,files_2: ArrayBuffer,model:string):Observable<any>{


    
    // Make http post request over api
      // with formData as req
      return this.http.post(APIUrl,[files_1,files_2,model] ,{observe: 'response' ,responseType: 'json'})

  }
  upload(APIUrl: string,files_1: ArrayBuffer,filename:string,model:string):Observable<any>{

      return this.http.post(APIUrl,[files_1,filename,model] ,{observe: 'response' ,responseType: 'json'})

  }
  setOption(value: string[]) {  
      
    this.pkl_value = value;  
  }  
  
  getOption() {  
    return this.pkl_value;  
  } 
}
