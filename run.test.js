const run = require('./run');


describe('with pre-set CONAN_USERNAME', () => {
  beforeAll(() => { process.env.CONAN_USERNAME = "john_doe"; });

  test('get_username', () => { expect(run.get_username()).toBe("john_doe") });

  afterAll(() => { delete process.env.CONAN_USERNAME; });
})


describe('with pre-set GITHUB_REPOSITORY', () => {
  beforeAll(() => {
    process.env.GITHUB_REPOSITORY = "willyw/chocolote-factory";
  });

  test('get_username', () => { expect(run.get_username()).toBe("willyw"); });

  afterAll(() => { delete process.env.GITHUB_REPOSITORY; });
});


describe('running', () => {
  const cwd = process.cwd();
  beforeAll(() => {
    process.env.CONAN_USERNAME = "john_doe";
    process.env["INPUT_BUILD-SCRIPT"] = "build.py";
    process.chdir("test");
  });

  test('run() runs', () => {
    return run.run().then(() => { return true; });
  });

  afterAll(() => {
    process.chdir(cwd);
    delete process.env.INPUT_BUILD_SCRIPT;
    delete process.env.CONAN_USERNAME;
  });
});
