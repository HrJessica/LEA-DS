import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalAnalyse;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get('http://localhost:5000/dashboard',{observe: 'response',responseType:'json'}).subscribe(data =>{
      this.totalAnalyse = data.body;
      this.totalAnalyse;
      console.log(this.totalAnalyse[0][0]);
    })
  }

}
