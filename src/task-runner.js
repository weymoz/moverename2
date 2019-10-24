const util = require('util');
const cliProgress = require('cli-progress');

function taskRunner(task, args, opts = {}) {
  return new Promise(resolve => {

    const limit = opts.limit || 5; 
    const showProgressBar = opts.progressBar && true;
    const total = args.length;
    let progress = 0;

    const bar = new cliProgress
      .SingleBar({}, cliProgress.Presets.shades_classic);

    if(showProgressBar) {
      bar.start(total, 0);
    }

    const promises = new Array(limit).fill(Promise.resolve());
    const results = [];
    let c = 0;
    let callCount = 1;

    function scheduleNextTask(p) {

      p.then(result => {

        if (result !== undefined) {
          results.push(result);
        }

        if (args.length) {

          if(showProgressBar) {
            bar.update(++progress);
          }

          let arg = args.shift();

          console.log(`Sceduling task ${callCount} of ${total}`);
          console.log(`with argument ${util.inspect(arg)}`);
          console.log(`----------------------------------------------`);

          callCount++;

          let np = task(arg);
          scheduleNextTask(np);
        } else {
          if (++c === limit) {

            if(showProgressBar){
              bar.stop();
            }

            resolve(results);
          }
        }
      });
    }

  debugger;
    promises.map(scheduleNextTask);
  });
}

module.exports = taskRunner;
