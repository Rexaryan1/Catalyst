import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavButton } from './nav-button.component';

describe('NavButtonComponent', () => {
  let component: NavButton;
  let fixture: ComponentFixture<NavButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavButton],
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
