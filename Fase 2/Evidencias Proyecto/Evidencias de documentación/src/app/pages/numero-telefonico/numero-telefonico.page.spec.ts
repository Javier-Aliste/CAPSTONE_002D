import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NumeroTelefonicoPage } from './numero-telefonico.page';

describe('NumeroTelefonicoPage', () => {
  let component: NumeroTelefonicoPage;
  let fixture: ComponentFixture<NumeroTelefonicoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NumeroTelefonicoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
