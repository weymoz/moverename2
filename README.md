# Torrent Helper - copy & rename files
Asyncronously copy all files downloaded via bitTorrent protocol
to one folder, renaming them according to given pattern

## Install
```
git clone https://github.com/weymoz/moverename2
npm install
```


## Configuration
Configuration could be done with the command line options
or in the **src/cofig.js**

### Command line example
```
node rename.js -t "/home/alul/rtorrent/watch/torrents"  -s "/home/alul/rtorrent/download/torrents" -d "/fo2/fj/upl/vids" --ti "/fo2/fj/upl/inf/titles.txt"

```

### Command line options
```
  -t - path to the folder with torrent files
  -s - path to the folder where torrents are saved
  -d - path to the folder were torrent content should be saved
  --ti - path to the file where the titles of torrents shoul be saved
  -c - concurecy limit (number of copy threads) (from 1 to 4)
```

