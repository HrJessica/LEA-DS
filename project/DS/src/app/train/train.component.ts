import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TrainUFileService } from '../service/train-u-file.service';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { Router } from '@angular/router';
import { toBase64String } from '@angular/compiler/src/output/source_map';
@Component({
  selector: 'app-train',
  templateUrl: './train.component.html',
  styleUrls: ['./train.component.css']
})
export class TrainComponent implements OnInit {
  @Input() bool = false;
  model_name!: string;
  csvContent_1!: ArrayBuffer;
  csvContent_2!: ArrayBuffer;
  csvContent_1_build!: ArrayBuffer;
  csvContent_2_build!: ArrayBuffer;
  @Input() selectedCSVFileName_1 :string = 'Select a data truth file';
  @Input() selectedCSVFileName_2 :string = 'Select a file data train';
  @Input() load : boolean = false;
  @Input() selectedCSVFileName_1_build :string = 'Select a data truth file';
  @Input() selectedCSVFileName_2_build :string = 'Select a file data train';
  private baseAPI!: string;
  constructor(
    private router: Router,
    private train_service: TrainUFileService
  ) { }
setName(evenement: Event){
  this.model_name = (evenement.target as HTMLInputElement).value
  
}

onFileChanged_first(files){
  const file =files.srcElement.files;
  if (file.length > 0) {
    this.selectedCSVFileName_1 = file[0].name;

    let input = files.target;
    let reader = new FileReader();
    reader.readAsText(input.files[0]);
    reader.onload = () => {
      let csvData = reader.result;
      let csvRecordsArray = (<ArrayBuffer>csvData);
      this.csvContent_1 = csvRecordsArray;
      console.log(this.csvContent_1)
      
    };
  }
  
}
onFileChanged_second(files_){
  const file_ = files_.srcElement.files;
  if(file_.length>0){
    this.selectedCSVFileName_2 = file_[0].name;
    let input = files_.target;
    let reader = new FileReader();
    reader.readAsText(input.files[0]);
    reader.onload = () => {
      let csvData = reader.result;
      let csvRecordsArray = (<ArrayBuffer>csvData);
      this.csvContent_2 = csvRecordsArray;
      
    };
  }
}



sendData(){
 this.baseAPI = 'http://localhost:5000/train';
 this.train_service.uploads(this.baseAPI,this.csvContent_1,this.csvContent_2,this.model_name).subscribe(
   res => {
     console.log(res);
   })
 
}

onFileChanged_first_build(files){
  const file =files.srcElement.files;
  if (file.length > 0) {
    this.selectedCSVFileName_1_build = file[0].name;

    let input = files.target;
    let reader = new FileReader();
    reader.readAsText(input.files[0]);
    reader.onload = () => {
      let csvData = reader.result;
      let csvRecordsArray = (<ArrayBuffer>csvData);
      this.csvContent_1_build = csvRecordsArray;
      
      
    };
  }

}
onFileChanged_second_build(files_){

  const file_ = files_.srcElement.files;
  if(file_.length>0){
    this.selectedCSVFileName_2_build = file_[0].name;
    let input = files_.target;
    let reader = new FileReader();
    reader.readAsText(input.files[0]);
    reader.onload = () => {
      let csvData = reader.result;
      let csvRecordsArray = (<ArrayBuffer>csvData);
      this.csvContent_2_build = csvRecordsArray;
      
    };
  }
}


@Input() message!: string;
newModel(){
  this.load = true;
  this.baseAPI = 'http://localhost:5000/build';
 this.train_service.uploads(this.baseAPI,this.csvContent_1_build,this.csvContent_2_build,this.model_name).subscribe(
   res => {
     if(res.status === 200 || res.status ===302){
       this.train_service.setOption(res.body)
       this.router.navigate(['/model_down'])
       //console.log(atob(res.body[2]))
     }
     else{
       this.message = 'Something is wrong! please try angain'
     }
   })
}
  ngOnInit(): void {
  }
custom(){
  this.bool = true;
}
}
