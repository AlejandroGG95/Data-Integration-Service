import { Injectable } from '@nestjs/common';
import { promises } from 'dns';
const mongoose = require('mongoose');

export type User = any;

@Injectable()
export class UsersService {
  private users: User[];

  constructor() {
    /* this.users = [
      {
        userId: 1,
        username: 'alejandro',
        password: 'contrase',
      }
    ]; */
    this.users = [];
    //this.user = this.connectDB().then(function (result) { return result });
  }

  async findOne(username: string): Promise<User | undefined> {
    //console.log(this.users.find(user => user.username === username));
    this.users.push(await this.connectDB(username))
    //console.log("Esto devuelve DB-> ", await this.connectDB(username));
    console.log("Result-> ", this.users);
    return this.users.find(user => user.username === username);
  }

  async connectDB(username: string) {

    //Abrimos una conexión con la base de datos nest
    mongoose.connect('mongodb://localhost/nest', { useNewUrlParser: true, useUnifiedTopology: true });
    //Realizamos la conexión con dicha base de datos.
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
      console.log("Se ha conectado con la base de datos correctamente");
    });
    //Definimos el schema de datos de la tabla de mongo con los tipos de datos que tendra o tiene(como una interface)
    var UserSchema = new mongoose.Schema({
      userId: Number,
      username: String,
      password: String
    });

    var Users = mongoose.model('users', UserSchema);

    let user = await Users.findOne({ username: username }, function (err, user) {
      if (err) {
        console.log(err);
      }
      if (!user) {
        console.log("404");
      }
      console.log(user);
      return user;
    }).exec().then((user) => { return user });
    /* var user = Users.find(function (err, usuarios) {
      if (err) return console.error(err);
      if (usuarios) {
        console.log(usuarios)
        return usuarios;
      }
    }).exec() *//* .exec().then(function (result) {
      return result;
    }); */
    /* user.then(function(docs){
      console.log('d', docs);
      return docs;
    },function(err) {
      return console.log('Err', err);
    }); */
    return user;
  }
}