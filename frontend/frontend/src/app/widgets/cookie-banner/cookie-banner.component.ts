import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-cookie-banner',
    standalone: false,
    templateUrl: './cookie-banner.component.html',
    styleUrl: './cookie-banner.component.css'
})
export class CookieBannerComponent implements OnInit {
    cookiesAccepted = false;

    ngOnInit(): void {
        const consent = localStorage.getItem('cookie-consent');
        if (consent === 'accepted') {
            this.cookiesAccepted = true;
        }
    }

    aceptarCookies(): void {
        localStorage.setItem('cookie-consent', 'accepted');
        this.cookiesAccepted = true;
    }
}
