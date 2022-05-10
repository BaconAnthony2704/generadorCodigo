export class CamposTablaModel{
  character_maximum_Length: number | null
  character_octet_length: number | null
  column_Default: string
  column_name: string
  data_type: string
  datetime_precision: number | null
  is_nullable: string
  numeric_Scale: number | null
  numeric_precision: number | null
  numeric_precision_radix: number | null
  ordinal_position: number
  table_Catalog: string
  table_name: string
  table_schema: string
  constructor(){
    this.character_maximum_Length=null
    this.character_octet_length=null
    this.column_Default= ""
    this.column_name= ""
    this.data_type= ""
    this.datetime_precision= null
    this.is_nullable= ""
    this.numeric_Scale= null
    this.numeric_precision= null
    this.numeric_precision_radix= null
    this.ordinal_position= 0
    this.table_Catalog= ""
    this.table_name= ""
    this.table_schema= ""
  }
}
