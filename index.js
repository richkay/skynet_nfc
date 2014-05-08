

function Plugin(messenger, options){
  this.messenger = messenger;
  this.options = options;
  return this;
}

var optionsSchema = {
  type: 'object',
  properties: {
    comport: {
      type: 'string',
      required: true
    }, target: {
      type: 'string',
      required: true
    }
  }
};

var messageSchema = {
  type: 'object',
  properties: {
    text: {
      type: 'string',
      required: true
    }
  }
};

var com = require("serialport");

var serialPort = new com.SerialPort(this.options.comport, {
    baudrate: 9600,
    parser: com.parsers.readline('\r\n')
  });


serialPort.on('open',function() {
  console.log('Port open');
});

serialPort.on('data', function(data) {
  console.log(data); 

  this.messenger.send({devices: this.options.target, message: {nfcid: data}});
                   
                   

   
});



Plugin.prototype.onMessage = function(message){
  var data = message.message || message.payload;
  //console.log(this.options.greetingPrefix + ', ' + message.fromUuid);
  if(message.fromUuid){
    this.messenger.send({devices: message.fromUuid, message: {greeting: this.options.nfcid + ' back atcha: ' + data.text}});
  }

}; 

Plugin.prototype.destroy = function(){
  //clean up
  console.log('destroying.', this.options);
};


module.exports = {
  Plugin: Plugin,
  optionsSchema: optionsSchema,
  messageSchema: messageSchema
};
