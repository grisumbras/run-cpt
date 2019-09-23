const core = require('@actions/core');
const exec = require('@actions/exec');


function get_username() {
  const repo = process.env['GITHUB_REPOSITORY'] || '';
  return (repo.split('/', 1) || [''])[0];
};


async function run() {
  try {
    console.log('Installing conan_package_tools...')
    await exec.exec('pip', ['install', 'conan_package_tools']);

    const conan_username = process.env['CONAN_USERNAME'] || get_username();
    const opts
      = { env: Object.assign({CONAN_USERNAME: conan_username}, process.env)
        };

    console.log('Running conan_package_tools...')
    await exec.exec('python', [core.getInput('build-script')], opts);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run()
