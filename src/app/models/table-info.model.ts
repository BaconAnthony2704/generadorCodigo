export class TablaInfoModel{
  table_Catalog:string;
  table_schema:string;
  table_name:string;
  table_Type:string;
  nombreTabla:string;

  constructor(){
    this.nombreTabla="",
    this.table_Catalog="",
    this.table_Type="",
    this.table_name="",
    this.table_schema=""
  }

}
