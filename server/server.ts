import dotenv from "dotenv"
dotenv.config({path: "./config.env"});
import express from "express";
import cors from "cors";
import router from "./routes/data";


// import { getEmails } from "./utils/notion";

const app  = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000

// getEmails();

app.use("/api/v1", router)

// app.get("/", (req, res) => {
//     res.status(200).json({
//         success: true,
//         message: "Hello world"
//     })
// })

app.listen(PORT, () => console.log(`Server listeing on port ${PORT}`))


//console.log("Hello world!");