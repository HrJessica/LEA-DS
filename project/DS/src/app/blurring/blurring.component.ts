import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Video } from './video';
import { FileUploadService } from '../service/file-upload.service';
import { Router } from '@angular/router';
import { state } from '@angular/animations';
@Component({
  selector: 'app-blurring',
  templateUrl: './blurring.component.html',
  styleUrls: ['./blurring.component.css']
})
export class BlurringComponent implements OnInit { 
     _video = new Video("",false,null);
  constructor(private fileUpload: FileUploadService, private router: Router) { }
  ngOnInit(): void {
    
  }
  
 
  onChange(event) {
    
    this._video.file = event.target.files[0]
    
  }
  onUpload(){
    this._video.loading = !this._video.loading;
   
      this.fileUpload.upload(this._video.file).subscribe(
        (res) => {
          this._video.loading = false;
         
          if(res.status === 200 ||res.status === 302) {
          
            this.fileUpload.setOption(res.body);
          
            this.router.navigate(['/download'])
          }
          else if(res.status === 401){
            this.router.navigate(['/'])
            
          }
          else if(res.status >= 500){
            this.router.navigate(['/'])
            
          }
      }
    )
    }

  }
 
  
 
