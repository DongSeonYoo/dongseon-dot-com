const nodeMailer = require("nodemailer");
const redisClient = require("../../config/database/redis");
const env = require("../config/env");


const sendWelcomeEmail = async (email) => {
    const transporter = nodeMailer.createTransport({
        service: "naver",
        host: "smtp.naver.com",
        port: 587,
        auth: {
            user: env.NODE_MAILER_ID,
            pass: env.NODE_MAILER_PW
        }
    });

    const option = {
        from: env.NODE_MAILER_ID,
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
            user: env.NODE_MAILER_ID,
            pass: env.NODE_MAILER_PW
        }
    });
    const authCode = Math.floor(Math.random() * 89999) + 10000;
    redisClient.set(email, authCode.toString());
    redisClient.expire(email, 180);

    const option = {
        from: env.NODE_MAILER_ID,
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
