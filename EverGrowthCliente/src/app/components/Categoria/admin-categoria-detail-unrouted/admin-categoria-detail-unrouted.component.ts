import { Component, Input, OnInit, Optional } from '@angular/core';
import { ICategoria } from 'src/app/model/model.interfaces';
import { HttpErrorResponse } from '@angular/common/http';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';
import { CategoriaService } from './../../../service/Categoria.service';

@Component({
  selector: 'app-admin-categoria-detail-unrouted',
  templateUrl: './admin-categoria-detail-unrouted.component.html',
  styleUrls: ['./admin-categoria-detail-unrouted.component.css']
})
export class AdminCategoriaDetailUnroutedComponent implements OnInit {


  @Input() id: number = 1;
  categorias: ICategoria = {} as ICategoria;
  status: HttpErrorResponse | null = null;
  

  constructor(
    private CategoriaService: CategoriaService,
    private router: Router,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {
    if (config && config.data) {
      this.id = config.data.id;
      console.log(this.config.data);
    }
  }

  ngOnInit() {
    console.log(this.id);

    
    this.getOne();
  }

  getOne(): void {
    this.CategoriaService.getOne(this.id).subscribe({
      next: (data: ICategoria) => {
        this.categorias = data;
        
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    });
  }
  volverAtras() {
    this.router.navigate(['/admin/categoria/plist']);
  }
}
