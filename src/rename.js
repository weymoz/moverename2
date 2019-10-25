#!/usr/bin/env node
const taskRunner = require('./task-runner.js');

const {
  log,
  readFile,
  readDir,
  getFilesFromTorrent,
  getAllFiles,
  getAllTorrents,
  absPath,
  torrentAbsPath,
  srcAbsPath,
  destAbsPath,
  copy,
  copy2,
  filenameWithoutExt,
  destFileName,
  createCopySources,
  filterFiles,
  fileExists,
  title,
  writeTitles,
} = require('./helpers');

const {
  TORRENTS_PATH,
  SRC_PATH,
  DEST_PATH,
  TITLES_PATH,
  GENRE,
  CONCUR_LIMIT,
  TURBO_MODE
} = require('./config');

(async () => {
  
  //Get absolute pathes to torrent files
  console.log('Searching for torrents at path:');
  console.log(TORRENTS_PATH + '\n');
  const torrents = (await getAllTorrents()).map(torrentAbsPath);
  console.log(torrents);
  console.log(`\n${torrents.length} torrents found`);

  //Get absolute pathes to files in torrents
  let files = await taskRunner(createCopySources, torrents, {
    progressBar: false,
    limit: 10,
  });

  //Flatten files array
  files = files.reduce((acc, val) => [...acc, ...val], []);

  //Filter non video files
  files = files.filter(filterFiles);

  //Filter files that not exist
  files = files.filter(fileExists);

  files = files.map((file, i) => ({
    title: title(file, i),
    src: file.src,
    dest: destFileName(file, i),
  }));

  console.log(files);
  console.log(`${files.length} files would be copied`);

  await writeTitles(files);

  const copyTask = TURBO_MODE ? copy2 : copy;
  console.log(`TURBO_MODE: ${TURBO_MODE}`);
  
  //Copy files
  Files = await taskRunner(copyTask, files, {
    progressBar: false,
    limit: CONCUR_LIMIT,
  });

  let copied = files.filter(file => file.dest !== null);
  let notCopied = files.filter(file => file.dest === null);
  console.log(`Copied files:\n${copied}\n${copied.length} files copied`);
  console.log(
    `\nNot copied files:\n${notCopied}\n${notCopied.length} files not copied`,
  );
})();
