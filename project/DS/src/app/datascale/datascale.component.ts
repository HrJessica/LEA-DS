import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ScaleserviceService } from '../service/scaleservice.service';
import { Data } from './data';
import { Router } from '@angular/router';
import { map } from 'rxjs';
@Component({
  selector: 'app-datascale',
  templateUrl: './datascale.component.html',
  styleUrls: ['./datascale.component.css']
})
export class DatascaleComponent implements OnInit {
  myData = new Data(0,'','');
  @Input() message;
  public msgIsNull: boolean = false;
  constructor(
    private router: Router ,
    private scale:ScaleserviceService
  ) { }

  
  ngOnInit(): void {
    this.msgIsNull = false;
  }
  public sendData(dataForm: NgForm){
    /*console.log(dataForm.form);
    console.log('la valeur: ',JSON.stringify(dataForm.value));*/
    this.scale.send_post_request(dataForm.value)
    .subscribe(
      res => {
        if(res.status === 200 ||res.status === 302) {
          
          this.scale.setOption(JSON.stringify(res));
          
          this.router.navigate(['/csv'])
        }
        else if(res.status === 203){
          this.message = res.body
          this.msgIsNull = true;
          
        }
       else if(res.status === 401){
         this.message = 'Error'
         this.msgIsNull = true;
        
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
