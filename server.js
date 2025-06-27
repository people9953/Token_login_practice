const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const users = [
  {
    user_id: "test",
    user_password: "1234",
    user_name: "테스트 유저",
    user_info: "테스트 유저입니다",
  },
];

const app = express();

app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    methods: ["OPTIONS", "POST", "GET", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

const secretKey = "ozcodingschool";

app.post("/", (req, res) => {
  const { userId, userPassword } = req.body;

  const userInfo = users.find(
    (el) => el.user_id === userId && el.user_password === userPassword
  );

  if (!userInfo) {
    res.status(401).send("로그인 실패");
  } else {
    const token = jwt.sign({ user_id: userInfo.user_id }, secretKey, {
      expiresIn: "1h",
    });
    res.send({ accessToken: token });
  }
});

app.get("/", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send("토큰 없음");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secretKey);

    const userInfo = users.find((u) => u.user_id === decoded.user_id);
    res.send(userInfo);
  } catch (err) {
    res.status(403).send("토큰 검증 실패");
  }
});

app.listen(3000, () => console.log("서버 실행!"));
