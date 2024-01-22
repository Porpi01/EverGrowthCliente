


export interface Sort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}

export interface Pageable {
    sort: Sort;
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
}

export interface IPage<T> {
    content: T[];
    pageable: Pageable;
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    sort: Sort;
    first: boolean;
    numberOfElements: number;
    empty: boolean;

    strSortField: string;
    strSortDirection: string;
    strFilter: string;
    strFilteredTitle: string;
    strFilteredMessage: string;
    nRecords: number;
}

export interface IEntity {
    id: number,
}

export interface IValoracion extends IEntity {

    titulo: string,
    fecha: Date,
    mensaje: string,
    user: IUsuario,
    producto: IProducto,
}

export interface IValoracionPage extends IPage<IValoracion> {
}

export interface IUsuario extends IEntity {
    nombre: string,
    apellido1: string,
    apellido2: string,
    email: string,
    telefono: string,
    username: string,
    password: string,
    direccion: string,
    rol: boolean,
    pedidos: number,
    carritos: number,
    valoracion: number

}

export interface IUsuarioPage extends IPage<IUsuario> {
}

export interface IProducto extends IEntity {

    nombre: string,
    precio: number,
    imagen: string,
    stock: number,
    categoria: number

}

export interface IProductoPage extends IPage<IProducto> {

}

export interface IPedido extends IEntity {

    fecha_pedido: Date,
    fecha_entrega: Date,
    estado_pedido: Boolean
    usuario: number
}

export interface IPedidoPage extends IPage<IPedido> {
}

export interface IDetallePedido extends IEntity {

    cantidad: number,
    precio_unitario: number,
    productos: number,
    pedidos: number
}
export interface IDetallePedidoPage extends IPage<IDetallePedido> {
}
export interface ICategoria extends IEntity {
    nombre: string
}

export interface ICategoriaPage extends IPage<ICategoria> {
}

export interface ICarrito extends IEntity {
    cantidad: number,
    productos: number,
    usuario: number
}

export interface ICarritoPage extends IPage<ICarrito> {
}



export type formOperation = 'EDIT' | 'NEW';

export interface SessionEvent {
    type: string;
}

