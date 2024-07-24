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
MenuList = [{name: 'Dashboard' , items: ['Dashboard']} ,
 {name: 'Gestion des utilisateurs' , route: 'user', items: ['Ajouter des utilisateurs'  ]},
  {name: 'Gestion des roles', items: ['Ajouter un role' ]}  ,
  {name: 'Gestion des permissions', items: ['Ajouter une permession']},
  {name: 'Gestion des formulaire' , route: 'createForm', items: ['Ajouter un formulaire' , 'Modifier un formulaire' , 'Supprimer un formulaire']},
  {name: 'List des formulaires soumis', route: ''}];
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
      this.router.navigate(['admin/userManagement/user']);
    }else if (item === 'Ajouter un role') {
      this.router.navigate(['admin/roleManagement/role']);
    }else if (item === 'Ajouter une permession') {
      this.router.navigate(['admin/permissionManagement/permission']);
    } else if (item === 'Gestion des formulaire' ){
      this.router.navigate(['admin/formsManagement/']);
    } else if (item === 'Dashboard' ){
      this.router.navigate(['admin/dashboardManagment/dashboard']);
    }else if ( item === 'List des formulaires soumis'){
      this.router.navigate(['admin/forms-submitted/formsList']);
    }
  }
}
