import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasaComponent } from './casa.component';

describe('BeneficiaryComponent', () => {
  let component: CasaComponent;
  let fixture: ComponentFixture<CasaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CasaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
