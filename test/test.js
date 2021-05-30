// Song: Cartoon - Howling (Ft. Asena)[NCS Release]
// Music provided by NoCopyrightSounds
// Free Download/Stream: http://ncs.io/Howling
// Watch: http://youtu.be/JiF3pbvR5G0

const fs = require('fs');
var amqp = require('amqplib/callback_api');

const config={
  protocol: 'amqp',
  hostname: 'localhost',
  port: 5672,
  username: 'merUser',
  password: 'passwordMER',
}

const GITHUB_WORKSPACE = process.env.GITHUB_WORKSPACE;
      qMain = 'genre',
      song = '{ "song": "happier", "artist": "marshmello" }',
      serv = '{"Service": "GenreFinder", "Error": "False", "Result": "bastille, electronic, love this, eletronic, Marshmello"}',
      qSec = 'management';

describe('Testing RabbitMQ', ()=>{
  it('Should connect to the RabbitMQ', (done)=>{
    amqp.connect(config, (err, conn)=>{
      if(err){
        console.log("Connection Error");
        return;
      }
      done();
      setTimeout(function() { conn.close();}, 500);
    });
  });

  it('Should send a music to find genre', (done)=>{
    amqp.connect(config, (err, conn)=>{
      if(err){
        console.log("Connection Error");
        return;
      }
      conn.createChannel((err, ch)=>{
        if(err){
          console.log("Error Creating Channel");
          return;
        }
        ch.assertQueue(qMain, { durable: false }); 
        ch.sendToQueue(qMain, Buffer.from(song),
          function(err) {
            if(err) {
              console.log("Error sending the message: ",err);
              return;         
            } else {
              console.log("Message sent");
              done();
          }
        });
      });
      done();
      setTimeout(function() { conn.close();}, 500);
    });
  });

  // it('Should create the RabbitMQ channel', (done)=>{
  //   amqp.connect(config, (err, conn)=>{
  //     if(err){
  //       console.log("Connection Error");
  //       return;
  //     }
  //     conn.createConfirmChannel((err, ch)=>{
  //       if(err){
  //         console.log("Error Creating Channel");
  //         return;
  //       }
  //       done();
  //       setTimeout(function() { conn.close();}, 500);
  //     });
  //   });
  // });

  it("Should receive the genre from RabbitMQ", (done)=>{
    setTimeout(function(){
      amqp.connect(config, (err, conn)=>{
        if(err){
          console.log("Connection Error");
          return;
        }
        conn.createChannel( (err, ch)=>{
          if(err){
            console.log("Error Creating Channel");
            return;
          }
          ch.assertQueue(qSec, { durable: false });
          ch.consume(qSec, function (msg) {
            if (JSON.stringify(msg.content.toString()) === JSON.stringify(serv)){
              done();
              setTimeout(function() { conn.close();}, 500);
            } else {
              console.log("Unexpected message");
              return;
            }
          }, { noAck: true });
        });
      });
    }, 4500);
  });
});