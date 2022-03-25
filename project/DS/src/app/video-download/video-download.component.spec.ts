import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoDownloadComponent } from './video-download.component';

describe('VideoDownloadComponent', () => {
  let component: VideoDownloadComponent;
  let fixture: ComponentFixture<VideoDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoDownloadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
