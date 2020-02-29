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
  console.log(`Running conan_package_tools with script ${script}...`)
  await exec.exec('python', [core.getInput('build-script')], opts);
}


module.exports =
  { run: run
  , get_username: get_username
  , get_cpt_version: get_cpt_version
  };
