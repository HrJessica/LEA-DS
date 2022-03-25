import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) {}

  downloadFile(){
		return this.http.get('http://localhost:5000/scaling', {responseType: 'json'});
  }
}
