//libs
var oModels = require('./models');
var oML = require('./ml');
//
var interprete=oML.interprete();
//
module.exports = {
  rory: function () {
    return rory;
  },
  grabarRespuesta:function(_data){
    oModels.mensaje.post(_data);
  }
};


var rory = {
  buscar:function(_data,_callback){
    //obtengo el comando y sujeto en array    
    var resultado=interprete.buscar(_data.message);    
    //obtener respuesta desde el screaping
    oModels.buscar([resultado,_data],_callback);    
  },
  verificandoMensaje: function(_data,_callback){
    oModels.mensaje.get(_data,_callback);
  }
}

//CAAIlSBX1DIoBANQcJxF4EF4hYNKq3HfjTv9ZBfL8JstvV4CRZAs5D2xZBlCMMQqHZCLVeZBhs6vogUi6Qsjf8tKL95nQms6DEYZBGihd2Af4KmdX8c1gXSeA00VH9CZBL3ZBbO47kcovj6TCuyMofZAVGODYD5p3ry6S1SlAfQiSFSv9CHNHKha5ySqDyefo48V8ZD
var oConfig = {
	fbAT:"CAAIlSBX1DIoBANQcJxF4EF4hYNKq3HfjTv9ZBfL8JstvV4CRZAs5D2xZBlCMMQqHZCLVeZBhs6vogUi6Qsjf8tKL95nQms6DEYZBGihd2Af4KmdX8c1gXSeA00VH9CZBL3ZBbO47kcovj6TCuyMofZAVGODYD5p3ry6S1SlAfQiSFSv9CHNHKha5ySqDyefo48V8ZD",
	FileDB:"./app/database/db.db",
	init:function()	{
    request('http://www.votoinformado.pe/voto/candidatos.aspx', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        
      }
    });
	}
}
//oConfig.init();