
const app = require("./app");

const pool = require("./database/db");

const PORT = process.env.PORT || 3000;

async function startServer() {

    try {
        const result =
            await pool.query(
                "SELECT NOW();"
            );
        console.log(
            "Connected to PostgreSQL"
        );
        app.listen(PORT, () => {
            console.log(
                `Server running on port ${PORT}`
            );
        });
    }
    catch (error) {
        console.error(error);
    }
}
startServer();