const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function resolveVersion(dependency) {
  return await new Promise((resolve) => {
    exec("npm outdated --json").then(stdout => {
      console.log("Success =>", stdout);
    })
      .catch(stderr => { // will always throw an error because 'npm outdated' return 1 as a success code and exec interpret it as a failed task
        const versions = Object.entries(JSON.parse(stderr.stdout)).map(([key, value]) => {
          return Object.assign({ name: key }, value);
        });

        const wantedVersion = versions.find(package => package.name === dependency).wanted;
        resolve(wantedVersion);
      });
  });
}
module.exports = resolveVersion;
