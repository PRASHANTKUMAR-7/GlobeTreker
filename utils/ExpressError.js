class ExpressError extends Error{
    constructor(statusCode, message){
        super();
        this.statusCode=statusCode;
        this.message=meddage;
    }
};
module.exports=ExpressError;