const request = require("supertest");
const app = require("../../../server");

it("POST /api/account/login 성공 시 status code는 200을 반환해야됌", async () => {
    const response = await request(app)
        .post("/api/account/login")
        .send({
            loginId: "userLoginId",
            password: "userPassword123",
        });

        expect(response.status).toBe(200);
});

it("로그인 api의 body 유효성 검사", async () => {
    const response = await request(app)
        .post("/api/account/login")
        .send({
            logind: "ehdtjs1234",
            password: "010612asd..",
        });

        expect(response.status).toBe(400);
})