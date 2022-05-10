import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CamposTablaModel } from 'src/app/models/campos_tabla.model';
import { TablaInfoModel } from 'src/app/models/table-info.model';
import {
  MSSQLNULLABLE,
  MSSQLType,
  sqlToModel,
} from '../constants/constant_obj';
import { MainHistoryService } from './main-history.service';

@Component({
  selector: 'app-main-history',
  templateUrl: './main-history.component.html',
  styleUrls: ['./main-history.component.css'],
})
export class MainHistoryComponent implements OnInit {
  constructor(
    private _mainService: MainHistoryService,
    private spinner: NgxSpinnerService
  ) {}

  tablaInfoList: TablaInfoModel[] = [];
  camposTablaList: CamposTablaModel[] = [];
  selectedInfoTabla: TablaInfoModel;
  storeProcedureTxt: string = '';
  angularServiceTxt: string = '';
  angularModelTxt: string = '';
  cModelText: string = '';
  cControllerTxt: string = '';
  cRepositoryTxt: string = '';
  cIdentificador:string='';

  ngOnInit(): void {
    this.obtenerListadoTablas();
  }

  obtenerListadoTablas() {
    this.spinner.show();
    this._mainService.obtenerListadoTabla().subscribe((data) => {
      this.tablaInfoList = data;
      console.log(data);
      this.spinner.hide();
    });
  }

  obtenerCamposTablas(evt: TablaInfoModel) {
    this.selectedInfoTabla = evt;
    this.spinner.show();
    this._mainService.obtenerCamposTablas(evt.table_name).subscribe(
      (data) => {
        this.spinner.hide();
        this.camposTablaList = data;
        console.log(this.camposTablaList);
      },
      (e) => {},
      () => {
        this.templateStoreProcedure();
        this.templateService();
        this.templateModel();
        this.templateCModel();
        this.templateCController();
        this.templateCRepository();
        this.templateCIdenficador();
      }
    );
  }

  templateStoreProcedure() {
    this.storeProcedureTxt = '';
    //select de todos o unot
    this.storeProcedureTxt += `CREATE PROCEDURE sp${this.capitalizarPalabra(this.selectedInfoTabla.nombreTabla)}_ver\n`;
    this.storeProcedureTxt += `@p_id AS BIGINT=NULL\n`;
    this.storeProcedureTxt += `AS\n`;
    this.storeProcedureTxt += `BEGIN\n`;
    this.storeProcedureTxt += `\tIF EXISTS(SELECT * FROM ${
      this.selectedInfoTabla.table_name
    } WHERE ${
      this.camposTablaList.find((x) => x.ordinal_position == 1).column_name
    }=@p_id)\n`;
    this.storeProcedureTxt += `\t\tSELECT * FROM ${
      this.selectedInfoTabla.table_name
    } WHERE ${
      this.camposTablaList.find((x) => x.ordinal_position == 1).column_name
    }=@p_id\n`;
    this.storeProcedureTxt += `\t\ELSE\n`;
    this.storeProcedureTxt += `\t\tSELECT * FROM ${this.selectedInfoTabla.table_name}\n`;
    this.storeProcedureTxt += `END\n\n`;
    this.storeProcedureTxt += `CREATE PROCEDURE sp${this.capitalizarPalabra(this.selectedInfoTabla.table_name)}_guardar\n`;

    this.camposTablaList.forEach((campo,index) => {
      this.storeProcedureTxt += `\t@p_${
        campo.column_name
      } AS ${campo.data_type.toUpperCase()}  ${
        campo.data_type == MSSQLType.VARCHAR ? '(' : ''
      } ${
        campo.character_maximum_Length > 0
          ? campo.character_maximum_Length
          : campo.data_type == MSSQLType.VARCHAR
          ? 'MAX'
          : ''
      } ${campo.data_type == MSSQLType.VARCHAR ? ')' : ''} ${
        campo.is_nullable == MSSQLNULLABLE.YES &&
        campo.data_type == MSSQLType.VARCHAR
          ? '= NULL'
          : ''
      } ${this.camposTablaList.length == index + 1 ? '' : ','}\n`;
    });
    this.storeProcedureTxt += `AS\n`;
    this.storeProcedureTxt += `BEGIN\n`;
    this.storeProcedureTxt += `\n\t IF (@p_${this.camposTablaList.find((x) => x.ordinal_position == 1).column_name}=-1)\n`;
    this.storeProcedureTxt += `\tBEGIN\n`;
    this.storeProcedureTxt += `\t\tINSERT INTO ${this.selectedInfoTabla.nombreTabla} (\n`;
    this.camposTablaList.forEach((campo,index) => {
      if (campo.ordinal_position != 1) {
        this.storeProcedureTxt += `\t\t ${campo.column_name} ${this.camposTablaList.length == index + 1 ? '' : ','}\n`;
      }
    });
    this.storeProcedureTxt += `\t\t) VALUES (\n`;
    this.camposTablaList.forEach((campo,index) => {
      if (campo.ordinal_position != 1) {
        this.storeProcedureTxt += `\t\t @p_${campo.column_name}${this.camposTablaList.length == index + 1 ? '' : ','} \n`;
      }
    });
    this.storeProcedureTxt += `\t\t)\n`;
    this.storeProcedureTxt += `\tEND\n\n`;
    this.storeProcedureTxt += `\tELSE\n`;
    this.storeProcedureTxt += `\tBEGIN\n`;
    this.storeProcedureTxt += `\t\tUPDATE ${this.selectedInfoTabla.nombreTabla} \n\t\tSET \n`;
    this.camposTablaList.forEach((campo, index) => {
      if (campo.ordinal_position != 1) {
        this.storeProcedureTxt += `\t\t${campo.column_name}=@p_${
          campo.column_name
        }${this.camposTablaList.length == index + 1 ? '' : ','}\n`;
      }
    });
    this.storeProcedureTxt += `\t\tWHERE ${this.camposTablaList.find((x) => x.ordinal_position == 1).column_name}=@p_${
      this.camposTablaList.find((x) => x.ordinal_position == 1).column_name
    }\n`;
    this.storeProcedureTxt += `\tEND\n`;
    this.storeProcedureTxt += `END\n`;
  }
  templateService() {
    this.angularServiceTxt = '';
    this.angularServiceTxt += `import { HttpClient } from '@angular/common/http';\n`;
    this.angularServiceTxt += `import { Injectable } from '@angular/core';\n`;
    this.angularServiceTxt += `import { Observable, throwError } from 'rxjs';\n`;
    this.angularServiceTxt += `import { catchError, map } from 'rxjs/operators';\n`;
    this.angularServiceTxt += `import { environment } from 'src/environments/environment';\n\n`;
    this.angularServiceTxt += `@Injectable({\n\tprovidedIn: 'root'\n})\n`;
    this.angularServiceTxt += `export class ${this.capitalizarPalabra(this.selectedInfoTabla.nombreTabla)}Service{\n`;
    this.angularServiceTxt += `\tconstructor(\n`;
    this.angularServiceTxt += `\t\t_http : HttpClient\n`;
    this.angularServiceTxt += `\t){}\n\n`;
    //Obtener
    this.angularServiceTxt += `\tobtener${this.capitalizarPalabra(this.selectedInfoTabla.nombreTabla)}(id?:number){\n`;
    this.angularServiceTxt += `\t\treturn this._http.post(environment.apiUrl+'/api/${this.capitalizarPalabra(this.selectedInfoTabla.nombreTabla)}/Obtener',{id:id})\n`;
    this.angularServiceTxt += `\t\t.pipe(\n`;
    this.angularServiceTxt += `\t\t\tmap((response)=>{\n`;
    this.angularServiceTxt += `\t\t\t\treturn response;\n`;
    this.angularServiceTxt += `\t\t\t}),\n`;
    this.angularServiceTxt += `\t\tcatchError((err,caught)=>{\n`;
    this.angularServiceTxt += `\t\t\t\tthrow err;\n`;
    this.angularServiceTxt += `\t\t})\n`;
    this.angularServiceTxt += `\t)\n`;
    this.angularServiceTxt += `\t}\n\n`;
    //Guardar
    this.angularServiceTxt += `\tguardar${this.capitalizarPalabra(this.selectedInfoTabla.nombreTabla)}(${this.capitalizarPalabra(this.selectedInfoTabla.nombreTabla)}model : ${this.capitalizarPalabra(this.selectedInfoTabla.nombreTabla)}Model){\n`;
    this.angularServiceTxt += `\t\treturn this._http.post(environment.apiUrl+'/api/${this.capitalizarPalabra(this.selectedInfoTabla.nombreTabla)}/Guardar',${this.capitalizarPalabra(this.selectedInfoTabla.nombreTabla)}model)\n`;
    this.angularServiceTxt += `\t\t.pipe(\n`;
    this.angularServiceTxt += `\t\t\tmap((response)=>{\n`;
    this.angularServiceTxt += `\t\t\t\treturn response;\n`;
    this.angularServiceTxt += `\t\t\t}),\n`;
    this.angularServiceTxt += `\t\tcatchError((err,caught)=>{\n`;
    this.angularServiceTxt += `\t\t\t\tthrow err;\n`;
    this.angularServiceTxt += `\t\t})\n`;
    this.angularServiceTxt += `\t)\n`;
    this.angularServiceTxt += `\t}\n`;

    this.angularServiceTxt += `}\n`;
  }
  templateModel() {
    this.angularModelTxt = '';
    this.angularModelTxt += `export class ${this.capitalizarPalabra(this.selectedInfoTabla.nombreTabla)}Model{\n`;

    this.camposTablaList.forEach((campo, i) => {
      this.angularModelTxt += `\t${
        this.capitalizarPalabra( campo.column_name).toLocaleLowerCase()
      } : ${this.obtenerAtributoModelo(campo.data_type)} \n`;
    });
    this.angularModelTxt += `\n`;

    this.angularModelTxt += `\tconstructor(){\n`;
    this.camposTablaList.forEach((campo, i) => {
      this.angularModelTxt += `\t${this.capitalizarPalabra( campo.column_name).toLowerCase()} =  ${
        campo.column_name.toLowerCase().includes('id') &&
        campo.data_type != MSSQLType.VARCHAR
          ? '-1'
          : this.obtenerConstructorModelo(campo.data_type)
      } \n`;
    });

    this.angularModelTxt += `\t}\n`;

    this.angularModelTxt += `}\n`;
  }

  templateCModel() {
    this.cModelText = '';
    this.cModelText += `public class ${this.capitalizarPalabra(this.selectedInfoTabla.nombreTabla)}{\n`;
    this.camposTablaList.forEach((campo, i) => {
      this.cModelText += `\tpublic ${this.obtenerConstructorCSharpModelo(
        campo.data_type
      )}  ${this.capitalizarPalabra( campo.column_name)}  { get; set; } \n`;
    });
    this.cModelText += `}\n`;
  }

  templateCController() {
    this.cControllerTxt = '';
    this.cControllerTxt += `[Route("api/[controller]")]\n`;
    this.cControllerTxt += `public class ${this.capitalizarPalabra(this.selectedInfoTabla.nombreTabla)}Controller: ControllerBase\n`;
    this.cControllerTxt += `{\n`;
    this.cControllerTxt += `\tprivate readonly Repository${this.capitalizarPalabra(this.selectedInfoTabla.nombreTabla)}Value _repo\n`;
    this.cControllerTxt += `\tpublic ${this.capitalizarPalabra(this.selectedInfoTabla.nombreTabla)}Controller(Repository${this.capitalizarPalabra(this.selectedInfoTabla.nombreTabla)}Value repository)\n`;
    this.cControllerTxt += `\t{\n`;
    this.cControllerTxt += `\t\t_repo=repository;\n`;

    this.cControllerTxt += `\t}\n`;
    //peticion get
    this.cControllerTxt += `\t[HttpPost("[action]")]\n`;
    this.cControllerTxt += `\tpublic async Task<List<${this.capitalizarPalabra(this.selectedInfoTabla.nombreTabla)}Model>> Obtener([FromBody] IdentificadorModel model)\n`;
    this.cControllerTxt += `\t{\n`;
    this.cControllerTxt += `\t\treturn await _repo.ObtenerTodas${this.capitalizarPalabra(this.selectedInfoTabla.nombreTabla)}(model);\n`;
    this.cControllerTxt += `\t}\n`;

    //peticion post
    this.cControllerTxt += `\t[HttpPost("[action]")]\n`;
    this.cControllerTxt += `\tpublic async Task<List<${this.capitalizarPalabra(this.selectedInfoTabla.nombreTabla)}Model>> Guardar([FromBody] ${this.capitalizarPalabra(this.selectedInfoTabla.nombreTabla)}Model model)\n`;
    this.cControllerTxt += `\t{\n`;
    this.cControllerTxt += `\t\treturn await _repo.Guardar${this.capitalizarPalabra(this.selectedInfoTabla.nombreTabla)}(model);\n`;
    this.cControllerTxt += `\t}\n`;

    this.cControllerTxt += `\n}`;
  }

  templateCRepository(){
    this.cRepositoryTxt="";
    this.cRepositoryTxt+=`public class Repository${this.capitalizarPalabra(this.selectedInfoTabla.nombreTabla)}Value\n`
    this.cRepositoryTxt+=`{\n`
    this.cRepositoryTxt+=`\tprivate readonly string _connectionString;\n`
    this.cRepositoryTxt+=`\tpublic Repository${this.capitalizarPalabra(this.selectedInfoTabla.nombreTabla)}Value(IConfiguration configuration)\n`
    this.cRepositoryTxt+=`\t{\n`
    this.cRepositoryTxt+=`\t\t_connectionString=configuration.GetConnectionString("Conexion");\n`
    this.cRepositoryTxt+=`\t}\n`

    //los metodo que vamos a utlizar para ir a los procedimientos
    this.cRepositoryTxt+=`\tpublic async Task<<List<${this.capitalizarPalabra(this.selectedInfoTabla.nombreTabla)}Model>> Obtener(IdentificadorModel model)\n`
    this.cRepositoryTxt+=`\t{\n`
    this.cRepositoryTxt+=`\t\tusing (SqlConnection sql=new SqlConnection(__connectionString))\n`
    this.cRepositoryTxt+=`\t\t{\n`
    this.cRepositoryTxt+=`\t\t\tusing (SqlCommand cmd=new SqlCommand("sp${this.capitalizarPalabra(this.selectedInfoTabla.nombreTabla)}_obtener",sql))\n`
    this.cRepositoryTxt+=`\t\t\t{\n`
    this.cRepositoryTxt+=`\t\t\t\tcmd.CommandType=System.Data.CommandType.StoredProcedure; \n`
    this.cRepositoryTxt+=`\t\t\t\tcmd.Parameters.Add( new SqlParameter("@p_${this.camposTablaList.find((x) => x.ordinal_position == 1).column_name}",model.id) ); \n`
    this.cRepositoryTxt+=`\t\t\t\tvar response=new List<<${this.capitalizarPalabra(this.selectedInfoTabla.nombreTabla)}Model>>(); \n`
    this.cRepositoryTxt+=`\t\t\t\tawait sql.OpenAsync(); \n`
    this.cRepositoryTxt+=`\t\t\t\tusing (var reader=await cmd.ExecuteReaderAsync()) \n`
    this.cRepositoryTxt+=`\t\t\t\t{ \n`
    this.cRepositoryTxt+=`\t\t\t\t\twhile( await reader.ReadAsync() ) \n`
    this.cRepositoryTxt+=`\t\t\t\t\t{ \n`
    this.cRepositoryTxt+=`\t\t\t\t\t\tresponse.Add(MapToValue${this.capitalizarPalabra(this.selectedInfoTabla.nombreTabla)}(reader)); \n`
    this.cRepositoryTxt+=`\t\t\t\t\t} \n`
    this.cRepositoryTxt+=`\t\t\t\t} \n`
    this.cRepositoryTxt+=`\t\t\t\treturn reponse;\n`
    this.cRepositoryTxt+=`\t\t\t}\n`
    this.cRepositoryTxt+=`\t\t}\n`
    this.cRepositoryTxt+=`\t}\n\n\n`
    //para guardar
    this.cRepositoryTxt+=`\tpublic async Task<<List<${this.capitalizarPalabra(this.selectedInfoTabla.nombreTabla)}Model>> Guardar(${this.capitalizarPalabra(this.selectedInfoTabla.nombreTabla)}Model model)\n`
    this.cRepositoryTxt+=`\t{\n`
    this.cRepositoryTxt+=`\t\tusing (SqlConnection sql=new SqlConnection(__connectionString))\n`
    this.cRepositoryTxt+=`\t\t{\n`
    this.cRepositoryTxt+=`\t\t\tusing (SqlCommand cmd=new SqlCommand("sp${this.capitalizarPalabra(this.selectedInfoTabla.nombreTabla)}_guardar",sql))\n`
    this.cRepositoryTxt+=`\t\t\t{\n`
    this.cRepositoryTxt+=`\t\t\t\tcmd.CommandType=System.Data.CommandType.StoredProcedure; \n`
    this.camposTablaList.forEach((campo,i)=>{
      this.cRepositoryTxt+=`\t\t\t\tcmd.Parameters.Add( new SqlParameter("@p_${campo.column_name}",model.${this.capitalizarPalabra(campo.column_name)}) ); \n`
    })
    this.cRepositoryTxt+=`\t\t\t\tvar response=new List<<${this.capitalizarPalabra(this.selectedInfoTabla.nombreTabla)}Model>>(); \n`
    this.cRepositoryTxt+=`\t\t\t\tawait sql.OpenAsync(); \n`
    this.cRepositoryTxt+=`\t\t\t\tawait cmd.ExecuteNonQueryAsync(); \n`
    this.cRepositoryTxt+=`\t\t\t\treturn; \n`
    this.cRepositoryTxt+=`\t\t\t}\n`
    this.cRepositoryTxt+=`\t\t}\n`
    this.cRepositoryTxt+=`\t}\n`


    //maptovalue
    this.cRepositoryTxt+=`\tprivate ${this.capitalizarPalabra(this.selectedInfoTabla.nombreTabla)}Model MapToValue${this.capitalizarPalabra(this.selectedInfoTabla.nombreTabla)}(SqlDataReader reader)\n`
    this.cRepositoryTxt+=`\t{\n`
    this.cRepositoryTxt+=`\t\treturn new ${this.capitalizarPalabra(this.selectedInfoTabla.nombreTabla)}Model  \n`
    this.cRepositoryTxt+=`\t\t{\n`
    this.camposTablaList.forEach((campo,i)=>{
      this.cRepositoryTxt+=`\t\t\t${this.capitalizarPalabra(campo.column_name)} = ${campo.data_type==MSSQLType.VARCHAR?"reader['"+(campo.column_name)+"'].ToString()"+(i+1<this.camposTablaList.length?",":""):(campo.data_type==MSSQLType.BIGINT || campo.data_type==MSSQLType.INT?"Convert.ToInt32(reader['"+(campo.column_name)+"'])"+(i+1<this.camposTablaList.length?",":""):(campo.data_type==MSSQLType.NUMERIC || campo.data_type==MSSQLType.FLOAT || campo.data_type==MSSQLType.DECIMAL?"Convert.ToDouble(reader['"+(campo.column_name)+"'])"+(i+1<this.camposTablaList.length?",":""):(campo.data_type==MSSQLType.DATETIME?"Convert.ToDateTime(reader['"+campo.column_name+"'])"+(i+1<this.camposTablaList.length?",":""):(campo.data_type==MSSQLType.BIT?"Convert.ToBoolean(reader['"+campo.column_name+"'])"+(i+1<this.camposTablaList.length?",":""):""))))}\n`
    })
    this.cRepositoryTxt+=`\t\t}\n`
    this.cRepositoryTxt+=`\t}\n`

    this.cRepositoryTxt+=`}\n`

  }
  templateCIdenficador(){
    this.cIdentificador = '';
    this.cIdentificador += `public class IdentificadorModel{\n`;
   this.cIdentificador+=`\tpublic string id { get; set; } \n`;
    this.cIdentificador += `}\n`;
  }


  obtenerAtributoModelo(tipo) {
    switch (tipo) {
      case MSSQLType.BIT:
        return sqlToModel.BIT;
      case MSSQLType.BIGINT:
        return sqlToModel.BIGINT;
      case MSSQLType.DATETIME:
        return sqlToModel.DATETIME;
      case MSSQLType.DECIMAL:
        return sqlToModel.DATETIME;
      case MSSQLType.DECIMAL:
        return sqlToModel.DECIMAL;
      case MSSQLType.FLOAT:
        return sqlToModel.FLOAT;
      case MSSQLType.INT:
        return sqlToModel.INT;
      case MSSQLType.NUMERIC:
        return sqlToModel.NUMERIC;
      case MSSQLType.VARCHAR:
        return sqlToModel.VARCHAR;
    }
  }

  obtenerConstructorModelo(tipo) {
    switch (tipo) {
      case MSSQLType.BIT:
        return true;
      case MSSQLType.DATETIME:
        return 'new Date()';
      case MSSQLType.DECIMAL:
        return 0.0;
      case MSSQLType.FLOAT:
        return 0.0;
      case MSSQLType.INT:
        return 0;
      case MSSQLType.NUMERIC:
        return 0.0;
      case MSSQLType.VARCHAR:
        return "''";
      case MSSQLType.BIGINT:
        return 0;
    }
  }

  obtenerConstructorCSharpModelo(tipo) {
    switch (tipo) {
      case MSSQLType.BIT:
        return 'bool';
      case MSSQLType.DATETIME:
        return 'DateTime';
      case MSSQLType.DECIMAL:
        return 'decimal';
      case MSSQLType.FLOAT:
        return 'float';
      case MSSQLType.INT:
        return 'int';
      case MSSQLType.NUMERIC:
        return 'decimal';
      case MSSQLType.VARCHAR:
        return 'string';
      case MSSQLType.BIGINT:
        return 'long';
    }
  }

  capitalizarPalabra(palabra: String) {
    palabra=palabra.toLowerCase();
    const arr = palabra.split(' ');
    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    const str2=arr.join(" ");
    return str2;
  }
}
