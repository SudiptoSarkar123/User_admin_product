const errorMiddleware = (err,req,res,next)=>{
    console.log(err.stack);

    const statusCode = err.statusCode || 500 ;
    const message = err.message || "Something went wrong!"


    if(typeof message === "object"){
        message = JSON.stringify(message,null,2)
    }

    return res.status(statusCode).json({
        success:false,
        message:message,
        errors:err.errors || [],
        stack:process.env.NODE_ENV === "DEVELOPMENT" ? err.stack : undefined
    })
}

export default errorMiddleware