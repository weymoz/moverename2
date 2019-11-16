const path = require('path');
const fs = require('fs');
const parseTorrent = require('parse-torrent');
const {promisify, inspect} = require('util');
const slugify = require('slugify');

const {
  TORRENTS_PATH,
  SRC_PATH,
  DEST_PATH,
  TITLES_PATH,
  GENRE,
} = require('./config');

const log = (exports.log = v => {
  console.log(v);
  return v;
});

const readFile = (exports.readFile = promisify(fs.readFile));

const readDir = (exports.readDir = promisify(fs.readdir));

const getFilesFromTorrent = (exports.getFilesFromTorrent = async torrentPath => {
  const buf = await readFile(torrentPath).catch(() => null);
  if (!buf) return [];
  const data = parseTorrent(buf);
  return data.files.map(file => file.path);
});

const getAllFiles = (exports.getAllFiles = path => async () =>
  await readDir(path));

const getAllTorrents = (exports.getAllTorrents = getAllFiles(TORRENTS_PATH));

const absPath = (exports.absPath = appPath => file => path.join(appPath, file));
const torrentAbsPath = (exports.torrentAbsPath = absPath(TORRENTS_PATH));
const srcAbsPath = (exports.srcAbsPath = absPath(SRC_PATH));
const destAbsPath = (exports.destAbsPath = absPath(DEST_PATH));

const copy = (exports.copy = async ({src, dest}) => {
  return new Promise((resolve, reject) => {
    fs.copyFile(src, dest, err => {
      if (err) {
        resolve(err => {
          console.log(err);
          return {src, dest: null};
        });
      }
      resolve({src, dest});
    });
  });
});

const copy2 = exports.copy2 = async ({src, dest}) => {
  return new Promise((resolve, reject) => {
    const srcStream = fs.createReadStream(src);
    const destStream = fs.createWriteStream(dest);
    srcStream.pipe(destStream);
    destStream.on('finish', resolve.bind(null, dest));
    destStream.on('error', reject.bind(null, src));
  });
};

const filenameWithoutExt = (exports.filenameWithoutExt = filePath =>
  path.basename(filePath, path.extname(filePath)));

const date = () => {
  let d = new Date();
  return `${d.getDate()}.${d.getDay()}`;
};

const number = index => ( index + 1 ).toString().padStart(4, '0');

const destFileName = (exports.destFileName = (file, index) => {
  const {src, torrent} = file;

  let srcFilename = slugify(filenameWithoutExt(src))
    .split('-')
    .slice(0, 3)
    .join('-');

  let torrentFilename = slugify(filenameWithoutExt(torrent))
    .replace(/Empornium|torrent/g, '')
    .split('-')
    .slice(0, 4)
    .join('-');

  const srcExt = path.extname(src);

  let fileName = `${date()}.${number(
    index,
  )}-${GENRE}-${torrentFilename}-${srcFilename}`;

  fileName = fileName.length > 90 ? fileName.slice(0, 89) : fileName;

  fileName = destAbsPath(fileName);
  fileName = `${fileName}.${srcExt}`;
  fileName = fileName.replace('..', '.');
  return fileName;
});

const createCopySources = (exports.createCopySources = async torrent => {
  const files = (await getFilesFromTorrent(torrent))
    .map(srcAbsPath)
    .map(file => ({torrent: torrent, src: file}));
  return files;
});

const filterFiles = (exports.filterFiles = file => {
  const ext = path.extname(file.src).slice(1);
  const filter = !(
    ext === 'jpg' ||
    ext === 'jpeg' ||
    ext === 'gif' ||
    ext === 'png' ||
    ext === 'rar' ||
    ext === 'txt' ||
    ext === 'nfo' ||
    ext === 'url' ||
    ext === 'zip'
  );
  return filter;
});

const fileExists = (exports.fileExists = file => fs.existsSync(file.src));

const title = (exports.title = ({torrent, src}, index) => {
  let title = path.basename(torrent).replace(/\[Empornium]|.torrent/g, '');
  return `${date()}.${number(index)}-${title}@@@\n`;
});

const cleanFile = filePath => {
  return new Promise(resolve => {
    fs.truncate(TITLES_PATH, err => {
      if (err) throw err;
      console.log(`${filePath} was cleaned`);
      resolve(filePath);
    });
  });
};

const writeTitle = ({title}) => {
  return new Promise(resolve => {
    fs.appendFile(TITLES_PATH, title, err => {
      if (err) throw err;
      console.log(`${title} was written to ${TITLES_PATH}`);
      resolve(title);
    });
  });
};

const writeTitles = (exports.writeTitles = async files => {
  await cleanFile(TITLES_PATH);
  return Promise.all(files.map(writeTitle));
});
