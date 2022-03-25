import { Component, Input, OnInit } from '@angular/core';
import { FileService } from '../service/file.service';
import { saveAs} from 'file-saver';
import { ScaleserviceService } from '../service/scaleservice.service';
import { map } from 'rxjs';
@Component({
  selector: 'app-csv',
  templateUrl: './csv.component.html',
  styleUrls: ['./csv.component.css']
})
export class CsvComponent {

  	title = 'Angular File Download From Server';
	public data!:string;
	constructor(private fileData: ScaleserviceService ) {
		this.data = fileData.getOption()
	}
	
	download() {
			
			const header = Object.keys(this.data[0]);
			const csv = this.data
			var blob = new Blob([csv], {type: 'text/csv' })
			saveAs(blob, "DataScaled.csv");
	}
	

}
