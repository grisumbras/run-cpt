const core = require('@actions/core');
const exec = require('@actions/exec');


function get_username() {
  const repo = process.env['GITHUB_REPOSITORY'];
  return repo.split('/', 1)[0];
};


async function run() {
  try {
    await exec.exec('pip' ['install', 'conan_package_tools']);

    const conan_username = process.env['CONAN_USERNAME'] || get_username();
    const opts = {env: {CONAN_USERNAME: conan_username}};
    await exec.exec('python' [core.getInput('build-script')], opts);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run()
