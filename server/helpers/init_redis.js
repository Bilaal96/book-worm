import redis from "redis";

const { REDIS_HOST, REDIS_PORT, REDIS_SECRET } = process.env;

const redisClient = redis.createClient({
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_SECRET,
});

redisClient.on("connect", () => {
    console.log("Connected to redis instance...");
});

redisClient.on("ready", (err) => {
    console.log("Redis client ready to use...");

    // Test set-get
    redisClient.set("foo", "bar", (err, reply) => {
        console.log("--- Redis Test ---");
        console.log("redisClient.set():", reply);
        redisClient.get("foo", (err, val) =>
            console.log("redisClient.get():", val)
        );
    });
});

redisClient.on("error", (err) => {
    console.log(err.message);
});

// On Disconnection
redisClient.on("end", (err) => {
    console.log("Client disconnected from Redis");
});

// Stop Redis on SIGINT (CTRL + C)
process.on("SIGINT", () => {
    redisClient.quit();
});

export default redisClient;
