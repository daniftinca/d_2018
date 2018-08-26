import {Directive, ElementRef, Injector, Input, NgZone, OnInit} from '@angular/core';
import {ControlValueAccessor} from "@angular/forms";

export interface ReCaptchaConfig {
  theme?: 'dark' | 'light';
  type?: 'audio' | 'image';
  size?: 'compact' | 'normal';
  tabindex?: number;
}

declare const grecaptcha: any;

declare global {
  interface Window {
    grecaptcha: any;
    reCaptchaLoad: () => void
  }
}

@Directive({
  selector: '[nbRecaptcha]'
})
export class RecaptchaDirective implements OnInit, ControlValueAccessor {

  @Input() key: string;
  @Input() config: ReCaptchaConfig = {};
  @Input() lang: string;

  private widgetId: number;

  private onChange: (value: string) => void;
  private onTouched: (value: string) => void;

  constructor(private element: ElementRef, private  ngZone : NgZone, private injector : Injector ) {
  }

  writeValue(obj: any): void {
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }


  addScript() {
    let script = document.createElement('script');
    const lang = this.lang ? '&hl=' + this.lang : '';
    script.src = `https://www.google.com/recaptcha/api.js?onload=reCaptchaLoad&render=explicit${lang}`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }

  ngOnInit() {
    this.registerReCaptchaCallback();
    this.addScript();
  }

  onExpired() {
    this.ngZone.run(() => {
      this.onChange(null);
      this.onTouched(null);
    });
  }

  onSuccess( token : string ) {
    this.ngZone.run(() => {
      this.onChange(token);
      this.onTouched(token);
    });
  }

  registerReCaptchaCallback() {
    window.reCaptchaLoad = () => {
      const config = {
        ...this.config,
        'sitekey': this.key,
        'callback': this.onSuccess.bind(this),
        'expired-callback': this.onExpired.bind(this)
      };
      this.widgetId = this.render(this.element.nativeElement, config);
    };
  }

  private render(element: HTMLElement, config): number {
    return grecaptcha.render(element, config);
  }

}
