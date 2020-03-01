const core = require('@actions/core');
const exec = require('@actions/exec');


function get_username() {
  let result = process.env.CONAN_USERNAME;
  if (!result) {
    const repo = process.env.GITHUB_REPOSITORY || '';
    result = (repo.split('/', 1) || [''])[0];
  }
  return result;
};


function get_cpt_version() {
  const version = core.getInput('install');
  let result = "conan_package_tools";
  if ("no" == version) {
    return null;
  } if ("latest" != version) {
    result = `${result}==${version}`;
  }
  return result;
};


function setup_compiler() {
  const compiler = core.getInput('compiler');
  const compiler_versions = core.getInput('compiler-versions');
  if (!compiler) {
    return;
  }
  console.log(`Setting compiler options...`);
  if (!compiler_versions) {
    throw Error('compiler-versions are not specified');
  }

  switch (compiler) {
    case 'gcc':
      process.env.CONAN_GCC_VERSIONS = compiler_versions;
      break;
    case 'apple_clang':
      process.env.CONAN_APPLE_CLANG_VERSIONS = compiler_versions;
      break;
    case 'vs':
      process.env.CONAN_VISUAL_VERSIONS = compiler_versions;
      break;
    case '':
      break;
    default:
      throw Error('Unknown compiler, either set this value to an empty string or ' +
        'to one of supported compilers: [gcc, apple_clang, vs]');
  }
  console.log(`compiler: ${compiler}`);
  console.log(`compiler versions: ${compiler_versions}`);
}


function setup_docker_images() {
  const docker_images = core.getInput('docker-images');
  if (!docker_images) {
    return;
  }
  console.log(`Setting docker image...`);
  if (docker_images === 'clear') {
    delete process.env.CONAN_DOCKER_IMAGES;
    console.log(`CONAN_DOCKER_IMAGES env var is deleted`);
  } else {
    process.env.CONAN_DOCKER_IMAGES = docker_images;
    console.log(`CONAN_DOCKER_IMAGES env var is set to ${docker_images}`);
  }
}


async function run() {
  const cpt_version = get_cpt_version();
  if (cpt_version) {
    console.log(`Installing ${cpt_version}...`)
    await exec.exec('pip', ["install", cpt_version]);
  }

  const opts
    = { env: Object.assign({CONAN_USERNAME: get_username()}, process.env)
      };
  const script = core.getInput('build-script');
  const work_dir = core.getInput('work-dir');
  if (work_dir) {
    console.log(`Setting working directory to ${work_dir}...`);
    await process.chdir(work_dir);
  }
  setup_compiler();
  setup_docker_images();
  console.log(`Running conan_package_tools with script ${script}...`)
  await exec.exec('python', [core.getInput('build-script')], opts);
}


module.exports =
  { run: run
  , get_username: get_username
  , get_cpt_version: get_cpt_version
  , setup_compiler: setup_compiler
  , setup_docker_images: setup_docker_images
  };
