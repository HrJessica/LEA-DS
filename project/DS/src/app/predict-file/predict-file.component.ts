import { Component, OnInit } from '@angular/core';
import { TrainUFileService } from '../service/train-u-file.service';
import { saveAs } from 'file-saver';
import { DATE_PIPE_DEFAULT_TIMEZONE } from '@angular/common';
@Component({
  selector: 'app-predict-file',
  templateUrl: './predict-file.component.html',
  styleUrls: ['./predict-file.component.css']
})
export class PredictFileComponent implements OnInit {
  data! : string[];
  data_line:string[] = [];
  constructor(
    private filecontent:TrainUFileService
  ) { 
    this.data = filecontent.getOption()
  }

  ngOnInit(): void {
  }
download(){
  
  for (var item of this.data) {
    this.data_line.push(item+';\n')
  }
      const header = Object.keys(this.data[0]);
			const csv = this.data_line
			var blob = new Blob(csv, {type: 'text/csv' })
			saveAs(blob, "predict.csv");
	}
}

