import dotenv from "dotenv"
dotenv.config()
import express from "express"
import dbcon from "./app/config/dbcon.js"
dbcon()
import morgan from "morgan"
import router from "./app/router/index.route.js"
import errorMiddleware from "./app/middleware/errorMiddleware.js"
import swaggerUi from 'swagger-ui-express'
import specs from './app/config/swagger.config.js'
import cors from "cors"


const app = express()
app.use(cors(
    {
        origin:"*"
    }
));

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use(morgan('dev'))

const port = process.env.PORT || 3001
console.log(port)
app.get('/',(req,res)=>{
    
    res.send(`<h1>Server is running at port ${port}</h1>`)
})



app.use('/api',router)
app.use(errorMiddleware)



app.listen(port, ()=>{
    console.log("Server is running at port ",port)
})
