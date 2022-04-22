import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TrainUFileService {
  pkl_value!: string[];
  message!:string;
  id!:string
  constructor(private http:HttpClient) {
   
   }
   uploads(APIUrl: string,files_1: ArrayBuffer,files_2: ArrayBuffer,model:string,architecture: number[]):Observable<any>{


    
    // Make http post request over api
      // with formData as req
      return this.http.post(APIUrl,[files_1,files_2,model,architecture] ,{observe: 'response' ,responseType: 'json'})

  }
  upload(APIUrl: string,files_1: ArrayBuffer,filename:string,model:string):Observable<any>{

      return this.http.post(APIUrl,[files_1,filename,model] ,{observe: 'response' ,responseType: 'json'})

  }
  train(APIUrl: string,files_1: ArrayBuffer,filename:string,model:string):Observable<any>{

    return this.http.post(APIUrl,[files_1,filename,model] ,{observe: 'response' ,responseType: 'json'})

}
  setMessage(msg : string){
    this.message = msg;
  }
  getMessage(){
    return this.message;
  }
  setIdentification(identification: string){
    this.id = identification;
  }
  getIdentification(){
    return this.id;
  }
  setOption(value: string[]) {  
      
    this.pkl_value = value;  
  }  
  
  getOption() {  
    return this.pkl_value;  
  } 
}
