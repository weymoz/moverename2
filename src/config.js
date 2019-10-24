const argv = require('yargs').argv;

module.exports = {
  GENRE: 'bdsm',
  TORRENTS_PATH: argv.t || '/home/mint/hetz/home/alul/rtorrent/watch/bdsm',
  SRC_PATH: argv.s || '/home/mint/hetz/home/alul/rtorrent/download/bdsm/',
  DEST_PATH: argv.d || '/home/mint/projects/moverename2/videos/',
  TITLES_PATH: argv.ti || '/home/mint/projects/moverename2/titles/titles.txt'
};
