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

  // Standard unit test
  it("should return 2", () => {
    expect(add(1, 1)).toEqual(2);
  });

  // problematic code
  it("should log hello world", () => {
    const spy = jest.fn();
    global.console = { log: spy, foo: 1 };
    helloWorld();
    expect(spy).toBeCalledWith("Hello world!");
  });

  it("mutates global", () => {
    expect(global.console.foo).toEqual(1);
  });

  // Without a type system we would have to test that every method
  // is present on our class and that each of them behave the same with
  // any amount of parameters.
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
    const now = new Date();
    const user2 = await new UserModel({ createdAt: now }).save();
    // How will we check if the default date really is correct?
    // What if the passed in date is correct but the defaut is broken inside mongoose?
    // What if other features are broken? Should we test all of mongoose in our code?
    expect(typeof user.createdAt).toEqual("object");
    expect(typeof user2.createdAt).toEqual("object");
    expect(user2.createdAt.toISOString()).toEqual(now.toISOString());
  });
});

// if we where using Typescript we may not need a test for this function
// It would be cheap to make tests so we should even with Typescript shouldn't we?
const add = (a, b) => {
  return a + b;
};

// What if the test costs more than the code?
const helloWorld = () => {
  console.log("Hello world!");
};
