import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
    let component: ButtonComponent;
    let fixture: ComponentFixture<ButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ButtonComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(ButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render default primary button correctly', () => {
        const buttonElement = fixture.nativeElement.querySelector('.button.button--primary');
        expect(buttonElement).toBeTruthy();
        expect(buttonElement.textContent).toBe('');
        expect(buttonElement.classList).toContain('button--primary');
        expect(buttonElement.classList).toContain('button--md');
        expect(buttonElement.type).toBe('button');

    });

    it('should emit onClick event when clicked', () => {
        spyOn(component.onClick, 'emit');
        component.handleClick();
        expect(component.onClick.emit).toHaveBeenCalled();
    });

    it('should render list of button variants correctly', () => {
        const buttonVariants = ['primary', 'outline', 'text', 'icon'];
        buttonVariants.forEach(variant => {
            component.variant = variant as ButtonComponent['variant'];
            fixture.detectChanges();
            const button = fixture.nativeElement.querySelector(`.button.button--${variant}`);
            expect(button).toBeTruthy();
        });
    })

    it('should render list of button colors correctly', () => {
        const buttonColors = ['primary', 'secondary', 'green', 'red', 'orange', 'teal', 'neutral', 'gray'];
        buttonColors.forEach(color => {
            component.color = color as ButtonComponent['color'];
            component.variant = 'primary';
            fixture.detectChanges();
            const button = fixture.nativeElement.querySelector(`.button.button--color-${color}`);
            expect(button).toBeTruthy();
        });
    })

    it('should render list of button sizes correctly', () => {
        const buttonSizes = ['sm', 'md', 'lg'];
        buttonSizes.forEach(size => {
            component.size = size as ButtonComponent['size'];
            component.variant = 'primary';
            fixture.detectChanges();
            const button = fixture.nativeElement.querySelector(`.button.button--${size}`);
            expect(button).toBeTruthy();
        });
    })

    it('should render list of button types correctly', () => {
        const buttonType = ['button', 'submit', 'reset'];
        buttonType.forEach(type => {
            component.type = type as ButtonComponent['type'];
            fixture.detectChanges();
            const button = fixture.nativeElement.querySelector(`.button`);
            expect(button.getAttribute('type')).toBe(type);
        });
    })

    it('should render label text when provided', () => {
        component.label = 'Salvar';
        fixture.detectChanges();

        const buttonElement: HTMLButtonElement = fixture.nativeElement.querySelector('button');
        expect(buttonElement.textContent).toContain('Salvar');
    });

    it('should apply disabled class and attribute when disabled is true', () => {
        component.disabled = true;
        component.variant = 'primary';
        fixture.detectChanges();

        const buttonElement: HTMLButtonElement = fixture.nativeElement.querySelector('button');
        expect(buttonElement.disabled).toBeTrue();
        expect(buttonElement.classList).toContain('button--primary--disabled');
    });

    it('should not emit onClick when disabled', () => {
        spyOn(component.onClick, 'emit');
        component.disabled = true;
        fixture.detectChanges();

        const buttonElement: HTMLButtonElement = fixture.nativeElement.querySelector('button');
        buttonElement.click();
        expect(component.onClick.emit).not.toHaveBeenCalled();
    });

    it('should apply loading class when loading is true', () => {
        component.loading = true;
        fixture.detectChanges();

        const buttonElement: HTMLButtonElement = fixture.nativeElement.querySelector('button');
        expect(buttonElement.classList).toContain('button--loading');
    });

    it('should not emit onClick when loading is true', () => {
        spyOn(component.onClick, 'emit');
        component.loading = true;
        fixture.detectChanges();

        const buttonElement: HTMLButtonElement = fixture.nativeElement.querySelector('button');
        buttonElement.click();
        expect(component.onClick.emit).not.toHaveBeenCalled();
    });

    it('should apply full-width class when fullWidth is true', () => {
        component.fullWidth = true;
        fixture.detectChanges();

        const buttonElement: HTMLButtonElement = fixture.nativeElement.querySelector('button');
        expect(buttonElement.classList).toContain('button--full-width');
    });

    it('should render icon when icon input is set', () => {
        component.icon = 'arrowLeft';
        fixture.detectChanges();

        const iconElement = fixture.nativeElement.querySelector('app-icon');
        expect(iconElement).toBeTruthy();
    });

    it('should set isIconOnly true when icon is set and no label provided', () => {
        component.icon = 'arrowLeft';
        component.label = '';
        fixture.detectChanges();

        expect(component.isIconOnly).toBeTrue();

        const buttonElement: HTMLButtonElement = fixture.nativeElement.querySelector('button');
        expect(buttonElement.classList).toContain('button--icon-only');
    });

    it('should position icon on the left when iconPosition is left', () => {
        component.icon = 'arrowLeft';
        component.label = 'Adicionar';
        component.iconPosition = 'left';
        fixture.detectChanges();

        const buttonContent = fixture.nativeElement.querySelector('.button__content');
        const firstChild = buttonContent.firstElementChild.tagName.toLowerCase();
        expect(firstChild).toBe('app-icon');
    });

});
