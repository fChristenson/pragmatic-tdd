const axios = require("axios");

module.exports = class UserService {
  getUsers() {
    return axios.get("http://localhost:30001/api/v1/users").then((d) => d.data);
  }
};
