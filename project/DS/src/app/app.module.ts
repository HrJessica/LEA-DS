import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AboutComponent } from './about/about.component';
import { BlurringComponent } from './blurring/blurring.component';
import { ResultComponent } from './result/result.component';
import { DatascaleComponent } from './datascale/datascale.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeadersComponent } from './headers/headers.component';
import { AngularFileUploaderModule } from "angular-file-uploader";
import { CsvComponent } from './csv/csv.component';
import { VideoDownloadComponent } from './video-download/video-download.component';
import { PaginationComponent } from './pagination/pagination.component';
import { TrainComponent } from './train/train.component';
import { PklComponent } from './pkl/pkl.component';
import { PredictFileComponent } from './predict-file/predict-file.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavbarComponent,
    AboutComponent,
    BlurringComponent,
    ResultComponent,
    DatascaleComponent,
    DashboardComponent,
    HeadersComponent,
    CsvComponent,
    VideoDownloadComponent,
    PaginationComponent,
    TrainComponent,
    PklComponent,
    PredictFileComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFileUploaderModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
