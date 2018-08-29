
### Start the CLI
start: npm start

### Automatically re-run on each save of preProcess.js
dev: npm run dev


### Commands

check         (-c)   //Checks for STT compatibility on audio file size, duration, sample rate, and MIMEtype. <br />
process       (-p)   //Augments files or directories of files for STT compatibility on audio file size, duration, sample rate, and MIMEtype.  <br />
split         (-s)   //Splits audio files over 100MB and outputs the resulting paths.  <br />
extractAudio  (-ev)  //Extracts audio from video files.  <br />


### TODO
- Fix check output.
- Update metadata as things happen in preprocessing.
- Preprocess text docs?
- Separate video audio and all the other audioSize
- Writes a file that maintains the linkage between the audio file and video file



CLI - Vorpal: https://github.com/dthree/vorpal <br />
Dev - Nodemon: https://nodemon.io/ <br />
