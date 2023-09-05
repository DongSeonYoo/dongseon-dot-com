const nodeMailer = require("nodemailer");

require("dotenv").config();

const send = async (data) => {
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
        from: process.env.NODEMAILER_ID + "@naver.com",
        to: data.email,
        subject: "회원가입을 축하합니다ㅎㅎ",
        text: "축하한다고요",
    }

    return await transporter.sendMail(option);
}

module.exports = send;
