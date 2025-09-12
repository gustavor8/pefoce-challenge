import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarComponent } from './avatar.component';

describe('AvatarComponent', () => {
  let component: AvatarComponent;
  let fixture: ComponentFixture<AvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.alt = 'Aux Text';
    component.size = 'sm';
    component.src = '/assets/images/avatar-1.png';
    component.additionalClasses = '';
    expect(component).toBeTruthy();
  });

  it('should have the correct alt prop', () => {
    component.alt = 'Aux Text';
    fixture.detectChanges();
    expect(component.alt).toBe('Aux Text');
  });

  it('should have the correct size prop', () => {
    component.size = 'sm';
    fixture.detectChanges();
    expect(component.size).toBe('sm');
  });

  it('should have the correct src prop', () => {
    component.src = '/assets/images/avatar-1.png';
    fixture.detectChanges();
    expect(component.src).toBe('/assets/images/avatar-1.png');
  });

  it('shoudl render a icon wherever a image is not provided', () => {
    component.src = '';
    component.icon = 'user';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-icon')).toBeTruthy();
  })

});
