import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventosComponent } from './components/eventos/eventos.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PalestrantesComponent } from './components/palestrantes/palestrantes.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { ContatosComponent } from './components/contatos/contatos.component';

// Esses components são carregados na tag <router-outlet> do 'app.component.html'
const routes: Routes = [
  { path: 'eventos', component: EventosComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'palestrantes', component: PalestrantesComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'contatos', component: ContatosComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // caso o usuário não digitar nada no endereço.
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' } // caso o usuário digitar caracteres inválidos no endereço.
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
