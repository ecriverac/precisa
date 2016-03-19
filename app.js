//lib
var FB = require('fb');


//config
var oConfig = require('./app/config');
var oController = require('./app/controllers');
//rorybot
var rory=oController.rory();
//para verificar el total de llamados
var totalComentarios,contadorComentarios,finalizado=false;
//demo de busqueda
/*rory.buscar("Cuales són partidos politicos?",fnRespuesta);
function fnRespuesta(_data){
  console.log(_data);
}*/

//paso 1 buscar preguntas en facebook
////me/conversations
//paso 2 bsucar de esa cobversacion 
// api/t_mid.1446922120218:c0a667e3456b953084?fields=messages
//paso 3 del id de data de los mensajes buscar si el id y fehca de mensaje esta registrado y fue respondido.
// api/ m_mid.1458302004040:cc66dfbaa641d29447?fields=message,from,created_time 
// los ejemplos son usando data de lo respondido por el api.

//------------FACEBOOK ZONE--------------

FB.setAccessToken(oConfig.AT());

var fbCheckConversations=function(){
  FB.api('me/conversations?fields=messages.fields(id,created_time,from,message).limit(6)', function (res) {
  if(!res || res.error) {
   console.log(!res ? 'error occurred' : res.error);
   return;
  }
  var cantidadConversaciones=res.data.length;
  totalComentarios=res.data.length;
  contadorComentarios=0;
  finalizado=false;
  for (var i=0;i<cantidadConversaciones;i++)  {
    //busqueda de mensajes de la conversacion
    var mensajeConcantenado="";
    for(var j=0;j<res.data[i].messages.data.length;j++){
      if(res.data[i].messages.data[j].from.id==oConfig.pageid()){
        break;
      }else{
        mensajeConcantenado+=" " + res.data[i].messages.data[j].message;
      }
    }
    //
    //agregamos id de mensaje para responderle  
    if(res.data[i].messages.data[0].from.id!=oConfig.pageid()) {
      var data=res.data[i].messages.data[0];
      data.idmensaje=res.data[0].id;
      //verifica si el mensaje existe
      
      
      rory.verificandoMensaje(data,function(_respuesta,_data){         
          //retorna false si no existeen la base de datos 
          //(si el mismo mensaje, de la misma persona,no ha 
          //sido observado por el bot)   
          //console.log(_respuesta);
          if(!_respuesta){
            //rory busca
            rory.buscar(_data,function(answer,_dataUser){
              //respondiendo al facebook              
              responder(_dataUser,answer);              
            });
          }
          
      });
    }else{
      contadorComentarios++;
    }         
    //    
  }
})};



function responder(_data,mensaje){
  oController.grabarRespuesta(_data);
  //return false;
  var mensaje=((mensaje[0])? mensaje[1] : _data[1].from.name+", "+mensaje[1]);
  console.log("facebook:"+mensaje);
  FB.api("/"+_data[1].idmensaje+"/messages",{method: 'post', message: mensaje},
    function(res){
      if(!res || res.error){
        console.log(!res ? 'error occurred': res.error);
        return ;
      }
  }); 
}


setInterval(
    fbCheckConversations
  ,4000);

/*rory.buscar({message:"que cargo tenia la china ?"},function(answer,_dataUser){
              //respondiendo al facebook              
              console.log(answer);              
            });*/