const ENVIRONMMENT = getEnvironmment();
const MONGODB_ENDPOINT = process.env.MONGODB_ENDPOINT;
const PORT = process.env.PORT || 3000;
const SECRET = process.env.SECRET || "dev-only-secret";

module.exports = {
    PORT,
    MONGODB_ENDPOINT,
    SECRET,
    ENVIRONMMENT,
};

function getEnvironmment() {
    return process.env.ENVIRONMMENT || "development";
}