const nodeMailer = require("nodemailer");
const redisClient = require("../../config/database/redis");

require("dotenv").config();

const sendWelcomeEmail = async (email) => {
    const transporter = nodeMailer.createTransport({
        service: "naver",
        host: "smtp.naver.com",
        port: 587,
        auth: {
            user: process.env.NODEMAILER_ID,
            pass: process.env.NODEMAILER_PW
        }
    });

    const option = {
        from: process.env.NODEMAILER_ID,
        to: email,
        subject: "회원가입을 축하합니다ㅎㅎ^^",
        text: "축하한다고요",
    }

    return await transporter.sendMail(option);
}

const sendVerifyEmail = async (email) => {
    const transporter = nodeMailer.createTransport({
        service: "naver",
        host: "smtp.naver.com",
        port: 587,
        auth: {
            user: process.env.NODEMAILER_ID,
            pass: process.env.NODEMAILER_PW
        }
    });
    // auth-aa1234@naver.com : 123123
    // cert-aa1234@naver.com : 1
    const authCode = Math.floor(Math.random() * 89999) + 10000;
    await redisClient.sAdd(email, authCode.toString());
    await redisClient.expire(email, 1200);

    const option = {
        from: process.env.NODEMAILER_ID,
        to: email,
        subject: "인증번호입니당",
        text: `인증번호: ${authCode}`,
    }

    return await transporter.sendMail(option);
}

module.exports = {
    sendWelcomeEmail,
    sendVerifyEmail
}
