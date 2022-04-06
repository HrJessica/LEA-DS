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
  public data!: string[]
  csvName: string = '';
  csvContent!: ArrayBuffer;
  model_name!: string;
  @Input() score!: number;
  @Input() test = false;
  constructor(
    private model: TrainUFileService,
    private router: Router){
      this.data = model.getOption();
   }

  ngOnInit(): void {
    this.score = parseFloat(this.data[0])
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
  