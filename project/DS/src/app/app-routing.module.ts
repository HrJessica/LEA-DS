import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { BlurringComponent } from './blurring/blurring.component';
import { CsvComponent } from './csv/csv.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DatascaleComponent } from './datascale/datascale.component';
import { HeadersComponent } from './headers/headers.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { VideoDownloadComponent } from './video-download/video-download.component';

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
    path: 'download',
    component: VideoDownloadComponent
  },
  {
    path: 'temporary',
    component: HeadersComponent
  },
  { path: '',   redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
