export default class NotFoundError extends Error{
    public status: number;
    constructor(message: string){
        super(message);
        this.name = this.constructor.name;
        this.status = 404;
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}