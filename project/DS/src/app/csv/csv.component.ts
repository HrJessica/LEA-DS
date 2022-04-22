import { Component, Input, OnInit } from '@angular/core';
import { saveAs} from 'file-saver';
import { ScaleserviceService } from '../service/scaleservice.service';

import { map } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-csv',
  templateUrl: './csv.component.html',
  styleUrls: ['./csv.component.css']
})
export class CsvComponent {

  	title = 'Angular File Download From Server';
	public data!:string;
	public csv: string[] = []
	constructor(
		private fileData: ScaleserviceService,
		private router: Router
		
	) {
		this.data = fileData.getOption();
		let arr = this.data.split("[");
		let array = arr[1].toString();
		let data_final = array.split(",")
		for(var item of data_final){
			this.csv.push(item+';\n')
		}
	}
	
	download() {
			console.log(this.csv)
			const header = Object.keys(this.data[0]);
			var blob = new Blob(this.csv, {type: 'text/csv' })
			saveAs(blob, "DataScaled.csv");
			this.router.navigate(['/scaling'])
	}
	

}
