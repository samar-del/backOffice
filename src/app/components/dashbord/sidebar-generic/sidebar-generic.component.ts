import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-sidebar-generic',
  templateUrl: './sidebar-generic.component.html',
  styleUrls: ['./sidebar-generic.component.css']
})
export class SidebarGenericComponent implements OnInit, AfterViewInit  {
  isSubmenuOpen: boolean[] = [];
  isExpanded = true;
  isShowing = true;
MenuList = [{name: 'Dashbord' , items: []} , {name: 'Gestion des utilisateurs' , items: ['Ajouter des utilisateurs' , 'Modifier des utilisateurs' , 'Supprimer des utilisateurs']},
  {name: 'Gestion des roles', items: ['Ajouter un role' , 'Modifier un role' , 'Supprimer un role']}  ,
  {name: 'Gestion des permissions', items: ['Ajouter une permession' , 'Modifier une permission' , 'Supprimer une permission']},
  {name: 'Gestion des formulaire' , route: 'createForm', items: ['Ajouter un formulaire' , 'Modifier un formulaire' , 'Supprimer un formulaire']}];
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 0);
      });
  }
  toggleSubMenu(index: number): void {
    this.isSubmenuOpen[index] = !this.isSubmenuOpen[index];
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 0);
  }
  // tslint:disable-next-line:typedef
  navigateTo(item: string) {
    if (item === 'Ajouter un formulaire'){
      this.router.navigate(['admin/formsManagement/createForm']);
    }else if (item === 'Ajouter des utilisateurs') {
      this.router.navigate(['/user']);
    }
    /*else if (item === 'Ajouter un role') {
      this.router.navigate(['/role']);
    }else if (item === 'Ajouter une permession') {
      this.router.navigate(['/permission']);
    }*/
  }
}
