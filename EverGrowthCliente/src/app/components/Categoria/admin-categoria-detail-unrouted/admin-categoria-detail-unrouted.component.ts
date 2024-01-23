import { Component, Input, OnInit, Optional } from '@angular/core';
import { ICategoria, IDetallePedido } from 'src/app/model/model.interfaces';
import { CategoriaService } from './../../../service/Categoria.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

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

}
