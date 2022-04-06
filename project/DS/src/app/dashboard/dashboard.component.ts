import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { saveAs} from 'file-saver';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalAnalyse;
  public current: number = 1;
  @Input() topics = [...Array().keys()].map(x => `item ${++x}`);
  public topicsToDisplay = [...Array()]
  public perPage = 8;
  public total = Math.ceil(this.topics.length / this.perPage)
    public onGoTo(page: number): void{
      this.current = page
      this.topicsToDisplay = this.paginate(this.current, this.perPage)
    }
    public onNext(page: number): void {
      if (page+1 <= this.total){
        this.current = page+1;
        this.topicsToDisplay = this.paginate(this.current,this.perPage)
      }
      else{
        this.topicsToDisplay = this.paginate(this.current,this.perPage)
      }
    }
    public onPrevious(page: number): void {
      this.current = page -1
      this.topicsToDisplay = this.paginate(this.current, this.perPage)
    }
    public paginate(current: number, perPage: number): string[]{
      return [...this.topics.slice((current - 1) * perPage).slice(0,perPage)]
    }
 
  
  constructor(private http: HttpClient) { }
  

 
  ngOnInit(): void {
   
    this.http.get('http://localhost:5000/dashboard',{observe: 'response',responseType:'json'}).subscribe(data =>{
      this.totalAnalyse = data.body;
      this.topics=this.totalAnalyse;
      this.topicsToDisplay = this.paginate(this.current, this.perPage)
      
    })
    
    
  }
  download(item:object) {
    const csv = item[3]
    console.log(csv)
    var blob = new Blob([csv], {type: 'text/csv' })
    saveAs(blob, item[1]+"scaled_data.csv");
}
  
  

}
