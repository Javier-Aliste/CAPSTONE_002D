import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';

import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getDatabase, provideDatabase } from '@angular/fire/database'; 

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp({
      "projectId": "proyectocitas-180e6",
      "appId": "1:979916711415:web:3e39930c34e03887483af2",
      "storageBucket": "proyectocitas-180e6.appspot.com",
      "apiKey": "AIzaSyDBd-chOnBmJuo8LfSeTDQvAwmWeSKcMKw",
      "authDomain": "proyectocitas-180e6.firebaseapp.com",
      "messagingSenderId": "979916711415"
    })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideDatabase(() => getDatabase()), 
  ],
});

