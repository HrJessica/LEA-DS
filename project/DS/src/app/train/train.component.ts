import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TrainUFileService } from '../service/train-u-file.service';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { Router } from '@angular/router';

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
  @Input() layersNumber :number = 5;
  @Input() isLayers = false;
  @Input() range;
  a_layer!:number;
  @Input() click: boolean = true;
  architecture = new Array(11,10,14,28,54); //architecture par defaut
  @Input() message!: string;
  private baseAPI!: string;
  constructor(
    private router: Router,
    private train_service: TrainUFileService
    
  ) { }
  displayStyle!:string;
setName(evenement: Event){
  this.model_name = (evenement.target as HTMLInputElement).value
  
}
onHandleRange(event: Event){
  
  this.layersNumber = parseInt((event.target as HTMLInputElement).value);
  this.isLayers = true;
  this.displayStyle = "block";
  this.range = [...Array(this.layersNumber).keys()]
    
 
}
onKey(event: KeyboardEvent) { 
  // if value is not empty the set click to false otherwise true
  this.click = (event.target as HTMLInputElement).value === '' ? true:false;
}


onClickSubmit(data){
 var array = new Array()
  for(let item in data){
    if (data[item]>50 || data[item] === '' || data[item] == 0){
      array.push(10)
    }
    else{
      array.push(data[item]);
    }
    
  }
  this.click = !this.click;
  this.displayStyle = "none";
  this.architecture = array; //architecture du reseau de neurone
  //console.log(this.architecture);
}

closePopup() {
  this.displayStyle = "none";
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

 this.train_service.uploads(this.baseAPI,this.csvContent_1,this.csvContent_2,this.model_name,this.architecture).subscribe(
   res => {
     if(res.status === 200){
      this.train_service.setOption(res.body[1]);
      this.router.navigate(['/model_down']);
      this.message = res.body[0];
      
     }
     else{
       this.message = 'An error occured ,Try again please!';
     }
     
   },
    error =>{
      this.message = error.error;
      console.log(error)
    });
 
 
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



newModel(){
  this.load = true;
  this.baseAPI = 'http://localhost:5000/build';
 this.train_service.uploads(this.baseAPI,this.csvContent_1_build,this.csvContent_2_build,this.model_name,this.architecture).subscribe(
   res => {
     if(res.status === 200 || res.status ===302){
       this.train_service.setOption(res.body)
       this.router.navigate(['/model_down'])
       let result =this.train_service.getOption()
       this.message = 'your Model identification is:'+result[1]+'_Id__00'+result[3]
       this.train_service.setMessage(this.message); //envoyer le message
       this.train_service.setIdentification(result[1]+'_Id__00'+result[3])
     }
     else{
       this.load = false;
       this.message = 'Something is wrong! please try angain';
       
     }
   },
   error =>{
     this.load = false;
     this.message = 'Error!! Verify your Entry';
     console.log("Error",error);
   })
}
  ngOnInit(): void {
    
  }
  close(){
    this.message = '';
  }
custom(){
  this.bool = true;
}
}
