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



app.get("/users/:username", async function(req, res) {
    const { username } = req.params;
    try {
        
        const response = await fetch(`https://api.github.com/users/${username}`);
        const data = await response.json();

        const expiresInSeconds = 60;

        await redisClient.setEx(username, expiresInSeconds ,JSON.stringify(data));
        res.status(200).json({
            data,
            from: "api"
        });

    } catch (error) {
        console.error(`Error fetching GitHub user: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, function(){
    console.log(`Listening on port ${PORT}`);
});
