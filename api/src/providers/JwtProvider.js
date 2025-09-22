import JWT from "jsonwebtoken";

/**
 * userInfo: Thông tin sẽ được nhúng trong token, thường bao gồm id, email, role...
 * secretSignature: Chuỗi bí mật dùng để ký token
 * tokenLife: Thời gian sống của token
 */
const generateToken = (userInfo, secretSignature, tokenLife) =>
  new Promise((resolve, reject) => {
    JWT.sign(
      userInfo,
      secretSignature,
      {
        algorithm: "HS256",
        expiresIn: tokenLife,
      },
      (err, token) => {
        if (err) return reject(err);
        resolve(token);
      }
    );
  });

const verifyToken = (token, secretSignature) =>
  new Promise((resolve, reject) => {
    JWT.verify(token, secretSignature, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });

export const jwtProvider = {
  generateToken,
  verifyToken,
};
