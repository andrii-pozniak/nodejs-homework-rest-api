const request = require("supertest");
const ctrlUsers = require("../../controllers/signup");
const mongoose = require('mongoose');
const app = require('../../app');
require('dotenv').config();
const { DB_HOST } = process.env;

mongoose.set('strictQuery', true);

console.log(DB_HOST)

app.use("/api/users/signup", ctrlUsers.signup);

afterAll(() => app.close);

describe("test signup controller", () => {

    mongoose.connect(DB_HOST)
        .then(() => {
            app.listen(3000, function () {
                console.log(`Database connect success`);
            });
        })
        .catch(error => {
            console.error(error.massage);
            process.exit(1)
        })
    it("signup return status 200", async () => {

        const response = await request(app)
            .post("/api/users/signup")
            .send({ email: "andrii@gmail.com", password: "111111" });
        console.log(response.status)
        expect(response.status).toEqual(201)
        const { email, subscription } = response.body
        expect(typeof email).toBe("string");
        expect(typeof subscription).toBe("string");
        // console.log("status", response.status)


        console.log(email, subscription)


    })

});

