export declare type User = any;
export declare class UsersService {
    private users;
    constructor();
    findOne(username: string): Promise<User | undefined>;
    connectDB(username: string): Promise<any>;
}
