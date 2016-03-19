/*
  Candidatos:
  ALAN GABRIEL LUDWIG GARCIA PEREZ  
  ISAAC ALFREDO BARNECHEA GARCIA  
  PEDRO PABLO KUCZYNSKI GODARD  
  VERONIKA FANNY MENDOZA FRISCH  
  
  ALEJANDRO TOLEDO MANRIQUE  
  ANTERO FLORES ARAOZ ESPARZA  
  FRANCISCO ERNESTO DIEZ-CANSECO TÁVARA  
  GREGORIO SANTOS GUERRERO  
  HERNANDO GUERRA GARCIA CAMPOS  
  KEIKO SOFIA FUJIMORI HIGUCHI  
  LUIS FERNANDO OLIVERA VEGA  
  MIGUEL WALTER HILARIO ESCOBAR  
  VLADIMIR ROY CERRON ROJAS  
  YEHUDE SIMON MUNARO  
*/

module.exports = {
  interprete: function () {
    return oInterprete;
  }
};
//ar Comandos
//var arConsultaSueldo = ["ConsultaSueldo","gana","sueldo","ingresos"];
//var arConsultaEstudios = ["ConsultaEstudios","maestrias","doctorados","estudio","estudios"];

//listado de cantidados
var arListadoGeneral = ["ListadoGeneral","cuales son", "quienes son",
                        "cuantos","listado de"];

//hoja de vida
var arUniversidad = ["Universidad", "pregrado","universidad","universitario"];
var arColegio = ["Colegio","cole","colegio","school","escuela"];
var arConsultaTrabajo = ["centro de trabajo","trabaja","trabajaba","trabajaba","chambeaba","donde trabajo","lugar trabajo"];
var arCargo = ["Cargo","cargo","chamba","que trabajo"];
var arDni= ["DNI Nº:","dni"," documento nacional de identidad"];
var arPais= ["País:","país","nacionalidad"];
var arDepartamento= ["Departamento:","departamento","nacimiento","nacio","nacido"];
var arProvincia=["Provincia:","provincia"];
var arDistrito=["Distrito:","distrito"];
var arSueldo = ["Total ingresos","gana","dinero","sueldo","ingreso","ingresos"];

var arSaludo = ["Hola","hi","holis","hola","hello","jelou"];
var arGracias = ["Gracias","thx","ty","gracias","thanks"];
var arAdios = ["Adios","bye","see you","nos vemos","chao","adios"];


//plan de gobierno
var arEconomia=["Economía","economia"];
var arMineria= ["Minería","minas","mineria","minero","mineras"];
var arEducacion=["Educación","educativo","educar","educacion"];
var arPobreza=["Pobreza","pobreza","pobres","pobre","misio"];
var arSeguridad=["Seguridad","delincuencia","choros","rateros","seguridad"];

var arGeneral=[arListadoGeneral, arConsultaTrabajo,arColegio,arUniversidad,
              arDni,arPais,arDepartamento,arProvincia,arDistrito,
              arEconomia,arEducacion,arMineria,arPobreza,arSeguridad,arCargo,arSueldo
              ,arSaludo,arGracias,arAdios];//matrix
//ar Sujetos
var arPP          = ["PP","partidos","partidos politicos","listo de partido"];
var arCandidatos  = ["Candidatos","candidatos","postulantes"];
//candidatos
var arAlan        = ["Alan","alan","garcia","perez"];
var arBarnecha    = ["Barnechea","alfredo","barnechea","issac","perez"];
var arPpk         = ["Kuczynski","Kuczynski","ppk","pedro","pablo","godard","ppkuy","ppcuy"];
var arVeronica    = ["Veronica","fanny","mendoza","frisch","Veronica"];
//---------
var arToledo        = ["Toledo","alejandro", "toledo", "manrique"];
var arAntero        = ["Antero","antero", "flores", "araoz", "esparza"];
var arErnesto       = ["Ernesto","francisco", "ernesto", "diez canseco",
                      "diez-canseco", "tavara"];
var arGregorio      = ["Gregorio","gregorio", "santos", "guerrero"];
var arNano          = ["Hernando","nano","hernando", "guerra", "garcia", "campos"];
var arKeiko         = ["Keiko","keiko", "sofia", "fujimori", "higuchi",
                       "china"];
var arLucho         = ["Luis","luis", "fernando", "olivera", "vega"];
var arMiguel        = ["Miguel","miguel", "walter", "hilario", "escobar"];
var arRojas         = ["Vladimir","vladimir", "roy", "cerron", "rojas"];
var arSimon         = ["Yehude","yehude", "simon", "munaro"];

var arSujetos     = [arPP,arCandidatos,arAlan,arBarnecha,arPpk,arVeronica,
                     arToledo, arAntero, arErnesto, arGregorio, arNano, 
                     arKeiko, arLucho, arMiguel, arRojas];//matrix



var oInterprete = {
  init:function(){

  },
	buscar:function(_texto){
    var texto=normalize(_texto);
    var comando=oInterprete.comando(texto);
    var sujeto=oInterprete.sujeto(texto);
    return [comando, sujeto];
  },
  comando:function(_texto){
    
    var comando="";
    loop1:{
        for (var j=0;j<arGeneral.length;j++){
        loop2:
          for (var i=0;i<arGeneral[j].length;i++){
            if(normalize(_texto).search(arGeneral[j][i])!=-1){
              comando=arGeneral[j][0];
              break loop1;
            }
          }      
        }  
    }  

    return comando;
  },
  sujeto:function(_texto){
    var sujeto="";
    loop1:
    for (var j=0;j<arSujetos.length;j++){
    loop2:
      for (var i=0;i<arSujetos[j].length;i++){
        if(normalize(_texto).search(arSujetos[j][i])!=-1){
          sujeto=arSujetos[j][0];
          break loop1;  
        }
      }      
    }  
    return sujeto;
  }
}


var normalize = (function() {
  var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç?", 
      to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc ",
      mapping = {};
 
  for(var i = 0, j = from.length; i < j; i++ )
      mapping[ from.charAt( i ) ] = to.charAt( i );
 
  return function( str ) {
      var ret = [];
      for( var i = 0, j = str.length; i < j; i++ ) {
          var c = str.charAt( i );
          if( mapping.hasOwnProperty( str.charAt( i ) ) )
              ret.push( mapping[ c ] );
          else
              ret.push( c.toLowerCase() );
      }      
      return ret.join( '' );
  }
 
})();

