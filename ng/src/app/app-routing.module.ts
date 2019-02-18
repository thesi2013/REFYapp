import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardComponent } from './components/card/card.component';
import { LabelScannerComponent } from './components/label-scanner/label-scanner.component';
import { GoodsInComponent } from './components/goods-in/goods-in.component';
import { GoodsOutComponent } from './components/goods-out/goods-out.component';
import { InternalRelocationComponent } from './components/internal-relocation/internal-relocation.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  {
    path: 'goods-in',
    component: GoodsInComponent,
    data: {
      title: 'Goods In'
    }
  },
  {
    path: 'goods-out',
    component: GoodsOutComponent,
    data: {
      title: 'Goods Out'
    }
  },
  {
    path: 'internal-relocation',
    component: InternalRelocationComponent,
    data: {
      title: 'Internal Relocation'
    }
  },
  {
    path: 'inventory',
    component: InventoryComponent,
    data: {
      title: 'Inventory'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login'
    }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
