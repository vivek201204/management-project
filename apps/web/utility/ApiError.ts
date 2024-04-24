interface ApiError {
    statusCode : number,
    data  : Object
    success : boolean
}
class ApiError extends Error {
    constructor(
        statusCode :number,
        message= "something went wrong",
       
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = Object ||null
        this.message = message
        this.success = false
       

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}
export {ApiError}