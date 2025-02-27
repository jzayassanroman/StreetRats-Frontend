import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosFiltradosComponent } from './productos-filtrados.component';

describe('ProductosFiltradosComponent', () => {
  let component: ProductosFiltradosComponent;
  let fixture: ComponentFixture<ProductosFiltradosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosFiltradosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosFiltradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
