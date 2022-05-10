export enum MSSQLType{
  VARCHAR='varchar',
  BIT='bit',
  NUMERIC="numeric",
  FLOAT="float",
  DATETIME="datetime",
  DECIMAL="decimal",
  INT="int",
  BIGINT="bigint"
}
export enum MSSQLNULLABLE{
  YES='YES',
  NO='NO'
}

export enum sqlToModel{
  VARCHAR="string",
  NUMERIC="number",
  FLOAT="number",
  BIT="boolean",
  DATETIME="Date",
  DECIMAL="number",
  INT="number",
  BIGINT="number"
}
