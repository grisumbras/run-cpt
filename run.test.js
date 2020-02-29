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


describe('with default install input', () => {
  beforeAll(() => { process.env.INPUT_INSTALL = "latest"; });

  test('get_cpt_version', () => {
    expect(run.get_cpt_version()).toBe("conan_package_tools");
  });

  afterAll(() => { delete process.env.INPUT_INSTALL; });
})


describe('with custon install input', () => {
  beforeAll(() => { process.env.INPUT_INSTALL = "1.20.0"; });

  test('get_cpt_version', () => {
    expect(run.get_cpt_version()).toBe("conan_package_tools==1.20.0");
  });

  afterAll(() => { delete process.env.INPUT_INSTALL; });
})


describe('with disabled install', () => {
  beforeAll(() => { process.env.INPUT_INSTALL = "no"; });

  test('get_cpt_version', () => {
    expect(run.get_cpt_version()).toBe(null);
  });

  afterAll(() => { delete process.env.INPUT_INSTALL; });
})


describe('running', () => {
  const cwd = process.cwd();
  beforeAll(() => {
    process.env.INPUT_INSTALL = "no";
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
    delete process.env.INPUT_INSTALL;
  });
});


describe('running with custom work-dir', () => {
  const cwd = process.cwd();
  beforeAll(() => {
    process.env.INPUT_INSTALL = "no";
    process.env.CONAN_USERNAME = "john_doe";
    process.env["INPUT_BUILD-SCRIPT"] = "../build.py";
    process.env["INPUT_WORK-DIR"] = "work-dir-change";
    process.chdir("test");
  });

  test('run() runs', () => {
    return run.run().then(() => { return true; });
  });

  afterAll(() => {
    process.chdir(cwd);
    delete process.env.INPUT_WORK_DIR;
    delete process.env.INPUT_BUILD_SCRIPT;
    delete process.env.CONAN_USERNAME;
    delete process.env.INPUT_INSTALL;
  });
});
