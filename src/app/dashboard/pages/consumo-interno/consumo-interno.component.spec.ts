import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumoInternoComponent } from './consumo-interno.component';

describe('ConsumoInternoComponent', () => {
  let component: ConsumoInternoComponent;
  let fixture: ComponentFixture<ConsumoInternoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumoInternoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsumoInternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
