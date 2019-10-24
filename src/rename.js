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
  filenameWithoutExt,
  destFileName,
  createCopySources,
  filterFiles,
  fileExists,
  title,
  writeTitles
} = require('./helpers');


(async () => {
  //Get absolute pathes to torrent files
  const torrents = ( await getAllTorrents()).map(torrentAbsPath);
  
  //Get absolute pathes to files in torrents
  let files = ( await taskRunner(createCopySources, torrents, 
    {
      progressBar: false,
      limit: 10
    }) )

  //Flatten files array
  files = files.reduce((acc, val) => [...acc, ...val], []);
 
  //Filter non video files
  files = files.filter(filterFiles);

  //Filter files that not exist
  files = files.filter(fileExists)

  files = files.map(( file, i ) => ({
    title: title( file, i ),
    src: file.src,
    dest: destFileName(file, i) 
  }))

  console.log(files);
  console.log(files.length);

  writeTitles(files);
  
  //Copy files
  Files = await taskRunner(copy, files, 
    {
      progressBar: false,
      limit: 40
    });
  Console.log(files);
  Console.log(files.length);
})()


