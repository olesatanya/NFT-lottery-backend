require("dotenv").config();
module.exports = {
    mongoURI: "mongodb://127.0.0.1:27017/nft_lottery",
    port: process.env.PORT,
    pinataApiKey: process.env.pinataApiKey,
    pinataSecretApiKey: process.env.pinataSecretApiKey,
};
