import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerperfilPage } from './verperfil.page';

describe('VerperfilPage', () => {
  let component: VerperfilPage;
  let fixture: ComponentFixture<VerperfilPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerperfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
