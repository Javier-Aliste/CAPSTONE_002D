import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NivelPage } from './nivel.page';

describe('NivelPage', () => {
  let component: NivelPage;
  let fixture: ComponentFixture<NivelPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NivelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
