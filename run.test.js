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


describe('setup compiler', () => {
  beforeEach(() => {
    process.env.CONAN_GCC_VERSIONS = 'some_gcc';
    process.env.CONAN_APPLE_CLANG_VERSIONS = 'some_clang';
    process.env.CONAN_VISUAL_VERSIONS = 'some_vs';
  })
  test('no changes', () => {
    run.setup_compiler();
    expect(process.env.CONAN_GCC_VERSIONS).toBe('some_gcc');
    expect(process.env.CONAN_APPLE_CLANG_VERSIONS).toBe('some_clang');
    expect(process.env.CONAN_VISUAL_VERSIONS).toBe('some_vs');
  })
  test('setup gcc', () => {
    process.env.INPUT_COMPILER = 'gcc';
    process.env['INPUT_COMPILER-VERSIONS'] = '4.8,5.0';
    run.setup_compiler();
    expect(process.env.CONAN_GCC_VERSIONS).toBe('4.8,5.0');
    expect(process.env.CONAN_APPLE_CLANG_VERSIONS).toBe('some_clang');
    expect(process.env.CONAN_VISUAL_VERSIONS).toBe('some_vs');
  })
  test('setup apple clang', () => {
    process.env.INPUT_COMPILER = 'apple_clang';
    process.env['INPUT_COMPILER-VERSIONS'] = '10,11';
    run.setup_compiler();
    expect(process.env.CONAN_GCC_VERSIONS).toBe('some_gcc');
    expect(process.env.CONAN_APPLE_CLANG_VERSIONS).toBe('10,11');
    expect(process.env.CONAN_VISUAL_VERSIONS).toBe('some_vs');
  })
  test('setup gcc', () => {
    process.env.INPUT_COMPILER = 'vs';
    process.env['INPUT_COMPILER-VERSIONS'] = '15,16';
    run.setup_compiler();
    expect(process.env.CONAN_GCC_VERSIONS).toBe('some_gcc');
    expect(process.env.CONAN_APPLE_CLANG_VERSIONS).toBe('some_clang');
    expect(process.env.CONAN_VISUAL_VERSIONS).toBe('15,16');
  })
  test('no versions', () => {
    process.env.INPUT_COMPILER = 'vs';
    expect(() => { run.setup_compiler(); }).toThrow(
      Error('compiler-versions are not specified'));
  })
  test('unknown compiler', () => {
    process.env.INPUT_COMPILER = 'unknown';
    process.env['INPUT_COMPILER-VERSIONS'] = '15,16';
    expect(() => { run.setup_compiler(); }).toThrow(
      Error('Unknown compiler, either set this value to an empty string or ' +
        'to one of supported compilers: [gcc, apple_clang, vs]'));
  })
  afterEach(() => {
    delete process.env.CONAN_GCC_VERSIONS;
    delete process.env.CONAN_APPLE_CLANG_VERSIONS;
    delete process.env.CONAN_VISUAL_VERSIONS;
    delete process.env.INPUT_COMPILER;
    delete process.env['INPUT_COMPILER-VERSIONS']
  })
})


describe('setup docker_image', () => {
  beforeEach(() => {
    process.env.CONAN_DOCKER_IMAGE = 'conanio/gcc48';
  })
  test('no changes', () => {
    run.setup_docker_image();
    expect(process.env.CONAN_DOCKER_IMAGE).toBe('conanio/gcc48');
  })
  test('custom image', () => {
    process.env['INPUT_DOCKER-IMAGE'] = 'my_docker_image';
    run.setup_docker_image();
    expect(process.env.CONAN_DOCKER_IMAGE).toBe('my_docker_image');
  })
  test('clear image', () => {
    process.env['INPUT_DOCKER-IMAGE'] = 'clear';
    run.setup_docker_image();
    expect('CONAN_DOCKER_IMAGE' in process.env).toBe(false);
  })
  afterEach(() => {
    delete process.env.CONAN_DOCKER_IMAGE;
    delete process.env['INPUT_DOCKER-IMAGE'];
  })
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
    delete process.env['INPUT_BUILD-SCRIPT'];
    delete process.env.CONAN_USERNAME;
    delete process.env.INPUT_INSTALL;
  });
});
