import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VertarjetaPage } from './vertarjeta.page';

describe('VertarjetaPage', () => {
  let component: VertarjetaPage;
  let fixture: ComponentFixture<VertarjetaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VertarjetaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
