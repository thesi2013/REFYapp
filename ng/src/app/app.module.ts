import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuth, AngularFireAuthModule} from '@angular/fire/auth';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavigationComponent} from './components/navigation/navigation.component';
import {LayoutModule} from '@angular/cdk/layout';
import {FlexLayoutModule} from '@angular/flex-layout';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCommonModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule,
} from '@angular/material';
import {environment} from '../environments/environment';
import {CardComponent} from './components/card/card.component';
import {HttpClientModule} from '@angular/common/http';
import {SSCCScannerComponent} from './components/ssccscanner/ssccscanner.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {OptionsSelectionComponent} from './components/options-selection/options-selection.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LabelScannerComponent} from './components/label-scanner/label-scanner.component';
import {BoxListComponent} from './components/box-list/box-list.component';
import {WebcamModule} from 'ngx-webcam';
import {GoodsInComponent} from './components/goods-in/goods-in.component';
import {GoodsOutComponent} from './components/goods-out/goods-out.component';
import {InternalRelocationComponent} from './components/internal-relocation/internal-relocation.component';
import {InventoryComponent} from './components/inventory/inventory.component';
import { LoginComponent } from './components/login/login.component';
import { EscapeHtmlPipe } from './pipes/keep-html.pipe';

@NgModule({
  declarations: [
    AppComponent,
    // views
    NavigationComponent,
    GoodsInComponent,
    GoodsOutComponent,
    InternalRelocationComponent,
    InventoryComponent,
    // components
    CardComponent,
    OptionsSelectionComponent,
    SSCCScannerComponent,
    LabelScannerComponent,
    BoxListComponent,
    LoginComponent,
    EscapeHtmlPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    HttpClientModule,
    ZXingScannerModule,
    WebcamModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    LayoutModule,
    FlexLayoutModule,
    // Material
    MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatCardModule,
    MatButtonToggleModule, MatSnackBarModule, MatInputModule, MatSelectModule,
    MatProgressSpinnerModule, MatPaginatorModule, MatTableModule, MatProgressBarModule, MatGridListModule,
    MatCommonModule, MatSortModule, MatAutocompleteModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
