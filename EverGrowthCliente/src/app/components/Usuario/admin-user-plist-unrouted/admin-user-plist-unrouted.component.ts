import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from './../../../service/Usuario.service';
import { MatTableDataSource } from '@angular/material/table';
import { IUsuario, IUsuarioPage } from 'src/app/model/model.interfaces';
import { HttpErrorResponse } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-admin-user-plist-unrouted',
  templateUrl: './admin-user-plist-unrouted.component.html',
  styleUrls: ['./admin-user-plist-unrouted.component.css']
})
export class AdminUserPlistUnroutedComponent implements OnInit {
  oPage: IUsuarioPage | undefined;
  orderField: string = "id";
  orderDirection: string = "asc";
  dataSource: MatTableDataSource<IUsuario> = new MatTableDataSource<IUsuario>([]);  
  status: HttpErrorResponse | null = null;
  displayedColumns: string[] = ['nombre', 'apellido1', 'apellido2', 'email', 'telefono'];

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(private UsuarioService: UsuarioService) { }

  ngOnInit() {
    this.getPage();
  }

  getPage(): void {
    if (this.paginator) {
      this.UsuarioService.getPage(this.paginator.pageSize, this.paginator.pageIndex, this.orderField, this.orderDirection).subscribe({
        next: (data: IUsuarioPage) => {
          this.oPage = data;
          if (this.paginator) {
            this.paginator.length = data.totalElements;
          }
          console.log(this.paginator?.length);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
        }
      });
    }
  }

  onPageChange(event: any) {
    if (event instanceof MatPaginator) {
      this.paginator = event;
      this.getPage();
    }
  }


}