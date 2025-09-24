import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import todoRoute from "../Backend/routes/todo.routes.js"
import userRoute from "../Backend/routes/user.routes.js"

const app = express()
dotenv.config()
const port = process.env.PORT || 4000;
const DB_URL=process.env.MONGODB_URL;

try{
  await mongoose.connect(DB_URL);
  console.log("Connected to MongoDB");
} catch(error){
  console.log(error);
}


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(express.json());

app.use("/todo",todoRoute);
app.use("/user",userRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
