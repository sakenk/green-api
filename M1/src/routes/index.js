const { processJobs } = require("../controllers/process");

module.exports = (app) => {
    app.post("/process", processJobs);

    app.get("/", (req, res) => {
        res.send("server working");
    });
};