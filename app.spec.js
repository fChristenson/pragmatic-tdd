const UserService = require("./src/UserService");
const mongoose = require("mongoose");

describe("TDD", () => {
  beforeAll(() => {
    mongoose.connect(process.env.MONGO_URI || "mongodb://0.0.0.0:27017/tests", {
      useNewUrlParser: true,
    });
  });

  afterAll((done) => {
    mongoose.connection.close(done);
  });

  it("should return 2", () => {
    expect(add(1, 1)).toEqual(2);
  });

  it("should log hello world", () => {
    const spy = jest.fn();
    global.console = { log: spy, foo: 1 };
    helloWorld();
    expect(spy).toBeCalledWith("Hello world!");
  });

  it("mutates global", () => {
    expect(global.console.foo).toEqual(1);
  });

  it("doesn't test anything meaningful", async () => {
    const mock = jest.fn(() => Promise.resolve([]));
    const userService = new UserService();
    userService.getUsers = mock;
    const users = await userService.getUsers();
    expect(Array.isArray(users)).toEqual(true);
    expect(mock).toBeCalled();
  });

  // How much work is needed to make this test trustworthy?
  it("does not work without the external system running", async () => {
    /*const userService = new UserService();
    const users = await userService.getUsers();
    expect(Array.isArray(users)).toEqual(true);*/
  });

  it("is impractical to test all external code", async () => {
    const Schema = mongoose.Schema;
    const UserSchema = new Schema({
      createdAt: { type: Date, default: Date.now },
    });
    const UserModel = mongoose.model("User", UserSchema);
    const user = await new UserModel().save();
    expect(typeof user.createdAt).toEqual("object");
  });
});

const add = (a, b) => {
  return a + b;
};

// What if the test costs more than the code?
const helloWorld = () => {
  console.log("Hello world!");
};
