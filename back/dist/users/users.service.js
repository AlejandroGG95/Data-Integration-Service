"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const mongoose = require('mongoose');
let UsersService = class UsersService {
    constructor() {
        this.users = [];
    }
    async findOne(username) {
        this.users.push(await this.connectDB(username));
        console.log("Result-> ", this.users);
        return this.users.find(user => user.username === username);
    }
    async connectDB(username) {
        mongoose.connect('mongodb://localhost/nest', { useNewUrlParser: true, useUnifiedTopology: true });
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function () {
            console.log("Se ha conectado con la base de datos correctamente");
        });
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
        }).exec().then((user) => { return user; });
        return user;
    }
};
UsersService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map