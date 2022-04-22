import { Component, Input, OnInit } from '@angular/core';
import { TrainUFileService } from '../service/train-u-file.service';
import { saveAs} from 'file-saver';
import { Router } from '@angular/router';
@Component({
  selector: 'app-pkl',
  templateUrl: './pkl.component.html',
  styleUrls: ['./pkl.component.css']
})
export class PklComponent implements OnInit {
  public data!: string[];
  @Input() filename_1= 'Choose a file';
  @Input() filename_2 ='Choose a file';
  csvName: string = '';
  csvContent!: ArrayBuffer;
  model_name!: string;
  @Input() score!: number;
  @Input() test = false;
  id!:string;
  
  constructor(
    private model: TrainUFileService,
    private router: Router){
      this.data = model.getOption();
      console.log(this.data)
      this.message = model.getMessage();
      this.id = model.getIdentification();
      if(typeof(this.data) === 'number'){
        this.score = parseFloat(this.data) ;
      }
      else{
        this.score = parseFloat(this.data[0]) ;
      }
        
     
   }

  ngOnInit(): void {
    
    this.model_name = this.data[1];
    
  }
download_pkl(){
  const pkl_content = atob(this.data[2]);
  
  var blob = new Blob([pkl_content], {type: 'pkl' })
			saveAs(blob, this.model_name);
}
onFileChanged(event){
  const file_ = event.srcElement.files;
  if(file_.length>0){
    this.csvName = file_[0].name;
    let input = event.target;
    let reader = new FileReader();
    reader.readAsText(input.files[0]);
    reader.onload = () => {
      let csvData = reader.result;
      let csvRecordsArray = (<ArrayBuffer>csvData);
      this.csvContent = csvRecordsArray;
      
    };
  }

}
test_model(){
  this.test = true;
}

train_model(){
  this.router.navigate(['/train'])
}

filecontent_1
OnSetFile_1(file_1){

  const file_ = file_1.srcElement.files;
  if(file_.length>0){
    this.filename_1 = file_[0].name;
    let input = file_1.target;
    let reader = new FileReader();
    reader.readAsText(input.files[0]);
    reader.onload = () => {
      let csvData = reader.result;
      let csvRecordsArray = (<ArrayBuffer>csvData);
      this.filecontent_1 = csvRecordsArray;
      console.log(this.filecontent_1)
    };
  }
}

filecontent_2
OnSetFile_2(file_2){

  const file_ = file_2.srcElement.files;
  if(file_.length>0){
    this.filename_2 = file_[0].name;
    let input = file_2.target;
    let reader = new FileReader();
    reader.readAsText(input.files[0]);
    reader.onload = () => {
      let csvData = reader.result;
      let csvRecordsArray = (<ArrayBuffer>csvData);
      this.filecontent_2 = csvRecordsArray;
      console.log(this.filecontent_2)
    };
  }
}

baseAPI!:string;
sendFiles(){
  this.baseAPI = 'http://localhost:5000/train';
  this.model.train(this.baseAPI,this.filecontent_1,this.filecontent_2,this.id).subscribe(
   res => {
     if(res.status === 200){
      this.score = res.body[1]
      this.router.navigate(['/model_down'])
      console.log(res);
     }
    
   })
}

message!: string;
send(){
  this.model.upload('http://localhost:5000/use_model',this.csvContent,this.csvName,this.model_name).subscribe(
    res =>{
      if(res.status === 200 ||res.status === 302) {
          
        this.model.setOption(res.body);
        
        this.router.navigate(['/predict'])
      }
      else if(res.status === 203){
        this.message = res.body
        //this.msgIsNull = true;
        
      }
     else if(res.status === 401){
       this.message = 'Error'
       //this.msgIsNull = true;
      
     }
  },
  error => {
    console.log("Error", error);
    
      },
  () => {
    console.log("POST is completed");
  }
  )
}
    }
