const userRoute = require("../modules/user/route");

module.exports = (app) => {
    app.use("/user", userRoute);

    app.get("/", (req, res) => {
        res.send("server working");
    });
};