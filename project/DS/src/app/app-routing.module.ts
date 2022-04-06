import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { BlurringComponent } from './blurring/blurring.component';
import { CsvComponent } from './csv/csv.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DatascaleComponent } from './datascale/datascale.component';
import { HeadersComponent } from './headers/headers.component';
import { PklComponent } from './pkl/pkl.component';
import { TrainComponent } from './train/train.component';
import { VideoDownloadComponent } from './video-download/video-download.component';
import { PredictFileComponent } from './predict-file/predict-file.component';
const routes: Routes = [
  {
    path: '',
    component: AboutComponent
  },
  {
    path: 'blur',
    component: BlurringComponent
  },
  {
    path: 'scaling',
    component: DatascaleComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  
  {
    path: 'csv',
    component: CsvComponent
  },
  {
    path: 'predict',
    component: PredictFileComponent
  },

  {
    path: 'download',
    component: VideoDownloadComponent
  },
  {
    path: 'temporary',
    component: HeadersComponent
  },
  {
    path: 'train',
    component: TrainComponent
  },
  {
    path: 'model_down',
    component: PklComponent
  },
  { path: '',   redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
