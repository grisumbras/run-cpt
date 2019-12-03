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


async function run() {
  const opts
    = { env: Object.assign({CONAN_USERNAME: get_username()}, process.env)
      };
  const script = core.getInput('build-script');
  console.log(`Running conan_package_tools with script ${script}...`)
  await exec.exec('python', [core.getInput('build-script')], opts);
}


module.exports =
  { run: run
  , get_username: get_username
  };
