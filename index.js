import express, { json } from "express";
import fetch from "node-fetch";
import { createClient } from "redis";
import { config } from "dotenv"

config()

const PORT = 5000;

const app = express();
app.use(json());

const redisClient = createClient({
    password:process.env.REDIS_PASSWORD,
    socket: {
        host:process.env.REDIS_HOST,
        port:process.env.REDIS_PORT,
    },
});

redisClient.on("error", function(error){
    console.log(`Client error: ${error}`);
});

redisClient.connect().catch(console.error);



app.listen(PORT, function(){
    console.log(`Listening on port ${PORT}`);
});
