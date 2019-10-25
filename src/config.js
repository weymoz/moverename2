
const argv = require('yargs').argv;

console.log(`[INFO] command line arguments:`)
console.log(`[INFO] ${JSON.stringify( argv )}`)


module.exports = {
  TURBO_MODE: argv.tb || false,
  GENRE: argv.g || "",
  CONCUR_LIMIT: argv.c || 4,
  TORRENTS_PATH: argv.t || '/home/mint/hetz/home/alul/rtorrent/watch/bdsm',
  SRC_PATH: argv.s || '/home/mint/hetz/home/alul/rtorrent/download/bdsm/',
  DEST_PATH: argv.d || '/home/mint/projects/moverename2/videos/',
  TITLES_PATH: argv.ti || '/home/mint/projects/moverename2/titles/titles.txt'
};
