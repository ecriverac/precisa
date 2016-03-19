//modulos
//var Firebase = require("firebase");
//var myFirebaseRef = new Firebase("https://precisabot.firebaseio.com/");

var fs = require('fs');
var request = require("request"),
cheerio = require("cheerio"),
sqlite3 = require('sqlite3').verbose(), 
fs = require("fs");
var oConfig = require('./config');
//
//database
var db = new sqlite3.Database(oConfig.FileDB());

 
db.close();
//busqueda & scraping
var _callbackRespuesta;
var _dataRespuesta;
var dataBuscar;
var command;
var page;
var subject;


module.exports = {
  buscar: function (_data,_callback) {

    //listadoGeneral
    _callbackRespuesta=_callback;
    _dataRespuesta=_data;
    dataBuscar=_data[0][0]+'-'+_data[0][1];   
    console.log(dataBuscar);


    switch(_data[0][0]){
      case "Adios":
      _callback([0,"Nos vemos!!!"],_data);
      return ;
      break;
      case "Hola":
      _callback([0,"Hola"],_data);
      return ;
      break;
      case "Gracias":
      _callback([1,"de nada!!!"],_data);
      return ;
      break;

    }

    //verificamos si no hay nada en algunos de los 2 variables
    if(_data[0][0]=="" || _data[0][1]==""){
      _callback([0,arRespuestaFalladas[Math.floor(Math.random() * 4)]],_data);
    }else{
      oScraping.buscar(dataBuscar);  
    }
  },
  mensaje : {
    get:function(_data,_callback){ 
      //console.log(typeof _data.id);
      

      var db = new sqlite3.Database(oConfig.FileDB());
      db.serialize(function() {
        db.get("select * from tb_mensajes where id = '"+_data.id+"'",function(err,row){
          if (typeof row === "undefined") {
            _callback(false,_data);
            //module.exports.mensaje.post(_data);
          }else{
            _callback(true,_data);
          }          
        });

      });
        db.close();       
    },//get
    post:function(_data){
      
      var db = new sqlite3.Database(oConfig.FileDB());
      db.serialize(function() {

        var stmt = db.prepare("INSERT INTO tb_mensajes(id,created_time,mensaje,respondido) VALUES (?,?,?,?)");
        stmt.run(_data[1].id,_data[1].created_time,_data[1].message,1);   
        stmt.finalize();
        db.close();
        console.log("grabo mensaje");
                
      });//serialize
    }//post

  }

};

var analizandoData={
  init:function(_body){        
    switch(dataBuscar) {
        case 'ListadoGeneral-PP':
          analizandoData.ListadoGeneraPP(_body);
          break;
        case 'ListadoGeneral-Candidatos':
          url='http://www.votoinformado.pe/voto/candidatos.aspx';
          break;        
        default:


          switch(page){
            case 'plan-de-gobierno-candidato':
              analizandoData.dataFromPlanDeGobierno(_body);
              analizandoData.dataFromFiles();
              break;
            default:
              analizandoData.dataFromHojaDeVida(_body);
          }
        
    }

  },
  dataFromHojaDeVida:function (_body){    
    var $ = cheerio.load(_body);
    var respuesta="";
    var respondio=false;
    var tam;
    switch(command){
      case "Cargo":
      console.log(command);      
      $("#ContentPlaceHolder1_ExperienciaLab tr").each(function(){                  

              tags=$(this).find("td");              
              str1=($(tags[0]).text().trim()).toUpperCase();              
              str2="CARGO";
              if(str1==str2){   
                  respondio=true;
                  respuesta=$(tags[1]).text();                  
                  _callbackRespuesta([1,respuesta],_dataRespuesta);
              }
                            
          
      });
      break;
      default:
      $("*").each(function(){
          
          str1=($(this).text().trim()).toUpperCase();  
          str2=command.toUpperCase();     
          //string.indexOf(substring) > -1)
          if(str1==str2){   
            switch($(this).prop("tagName")){
              case "TD":        
                respondio=true;
                tagResponse=$(this).parent().find("td");
                respuesta=($(tagResponse[tagResponse.length-1]).text()); 
                _callbackRespuesta([1,respuesta],_dataRespuesta);
                //respuesta=$(response[1]).text();
                
              break;

            }
            
          }
      });
    }
    //if(!respondio)
       // _callbackRespuesta([0,arRespuestaFalladas[Math.floor(Math.random() * 4)]],_dataRespuesta);

  },
  dataFromPlanDeGobierno:function (_body){
    var $ = cheerio.load(_body);
    var respuesta="";
    var respondio=false;

    $("td span").each(function(){

        str1=($(this).text()).toUpperCase();
        str2=command.toUpperCase();     
        
        //console.log(str1);
        if(str1.indexOf(str2) > -1){
               //console.log(str1);
              respondio=true;
              respuesta=$(this).text(); 
              _callbackRespuesta([1,respuesta],_dataRespuesta);
        }
        

    });

    //if(!respondio)
      //  _callbackRespuesta([0,arRespuestaFalladas[Math.floor(Math.random() * 4)]],_dataRespuesta);
  },
  dataFromFiles:function(){
    console.log("leyendo archivos de planes de gobierno");
    switch(subject){
      case "Alan" :
      case "Barnechea" :
      case "Kuczynski" :
      case "Veronica" :
      case "Keiko" :
          fs.readFile('./data/'+subject+'.txt', function (err, data) {
             text=data.toString();
             str1=text.toLowerCase();
             str2=command.toLowerCase();   

             parts=str1.split("<"+str2+">");


             if(parts.length > 1)
                return _callbackRespuesta([1,parts[1]],_dataRespuesta);
                  
                

             

          });
      
    }
  },
  ListadoGeneraPP:function(_body){
    var $ = cheerio.load(_body);
    var respuesta="";
    $('.listaCand .candidato').each(function(i, element){
      respuesta+=($(this).text())+"\n\r";
    });//each
    _callbackRespuesta([1,respuesta],_dataRespuesta);
  }
}

var oScraping = {
	buscar:function(_data){
    var body='';
    var url='';


    //console.log(_data);
    switch(_data) {
        case 'ListadoGeneral-PP':
        case 'ListadoGeneral-Candidatos':          
          url='http://www.votoinformado.pe/voto/candidatos.aspx';
          break;
        default:
          parts=_data.split('-');
          command=parts[0];
          subject=parts[1];

          page="";
          switch(command){
            case "Minería":
            case "Mine":
            case "Economía":
            case "Educación":
            case "Pobreza":
            case "Seguridad":
              page="plan-de-gobierno-candidato";
              break;
            default:
              page="hoja-de-vida";
          }
          //console.log(page);
          switch(subject){
            case "Alan":
              url='http://www.votoinformado.pe/voto/'+page+'.aspx?p=tlQSb3OZcVuYNMmq1WWNuA==';
              break;
            case "Barnechea":
              url='http://www.votoinformado.pe/voto/'+page+'.aspx?p=YAO7BPtEwnZA1JKjYPi5bg==';
              break;
            case "Kuczynski":                  
              url='http://www.votoinformado.pe/voto/'+page+'.aspx?p=LY2dKAohPUYfndrwJjVjeA==';
              break;
            case "Veronica":
              url='http://www.votoinformado.pe/voto/'+page+'.aspx?p=3iz9wlxoUauNn0QrROG6mg==';
              break;
            case "Toledo":
              url='http://www.votoinformado.pe/voto/'+page+'.aspx?p=N9Y/IW3mXDoThGhnMKBY8g==';
              break;
            case "Antero":
              url='http://www.votoinformado.pe/voto/'+page+'.aspx?p=QkyEEpLl3I207TJ/XuSSfg==';
              break;
            case "Ernesto":
              url='http://www.votoinformado.pe/voto/'+page+'.aspx?p=MybrQnxFKXB4B7am0Ye/Sw==';
              break;
            case "Gregorio":
              url='http://www.votoinformado.pe/voto/'+page+'.aspx?p=aV+JfryhX5d22EC5JQFLFA==';
              break;
            case "Hernando":
              url='http://www.votoinformado.pe/voto/'+page+'.aspx?p=/jia+0NXoFKDyH9XsKiPwA==';
              break;
            case "Keiko":
              url='http://www.votoinformado.pe/voto/'+page+'.aspx?p=H6D4T5j3KFO2/z2EkcXKsQ==';
              break;
            case "Luis":
              url='http://www.votoinformado.pe/voto/'+page+'.aspx?p=2eZSVZ2VlADx/DyOdM9+Xw==';
              break;
            case "Miguel":
              url='http://www.votoinformado.pe/voto/'+page+'.aspx?p=afQ2dn+B6k8r0vK/jKKvTQ==';
              break;
            case "Vladimir":
              url='http://www.votoinformado.pe/voto/'+page+'.aspx?p=SnJrIgfPauC5aibVOmVZMg==';
            break;
            case "Yehude":
              url='http://www.votoinformado.pe/voto/'+page+'.aspx?p=XKRK8bcDh0I74md0CQMV4w==';
            break;
            default:
              _callbackRespuesta([0,arRespuestaFalladas[Math.floor(Math.random() * 4)]],_dataRespuesta);
          }
    }
    oScraping.scrapping(url,analizandoData.init);
  },
  scrapping:function(_url,_function){    
    console.log(_url);
    request(_url, function (error, response, body) {
      //console.log(response.statusCode);
      if (!error && response.statusCode == 200) {        
        _function(body);
      }
    });
  }
}

var arRespuestaFalladas=["en este momento no se como responderte esta pregunta","lamentablemente no encuentro respuesta a tu pregunta","aun no encuentro alguna respuesta valida que darte","sorry, no sé :-("];