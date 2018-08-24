
### Start the CLI
-start: npm start

### Automatically re-run on each save of preProcess.js
dev: npm run dev


### Commands
- check         (-c)   //Checks for STT compatibility on audio file size, duration, sample rate, and MIMEtype.
- process       (-p)   //Augments files or directories of files for STT compatibility on audio file size, duration, sample rate, and MIMEtype.
- split         (-s)   //Splits audio files over 100MB and outputs the resulting paths.       
- extractAudio  (-ev)  //Extracts audio from video files.


### TODO
- Switch preprocess pipeline to run on directories of files
- Do we change from narrowband to broadband to accommodate arabic
- Separate video audio and all the other audioSize
- Writes a file that maintains the linkage between the audio file and video file
- Dump the entire metadata object into the object we pass on to other systems/write to a json file.

- FLAC if space permits for lossless.
- MP3 if we can afford slight compression.

CLI - Vorpal: https://github.com/dthree/vorpal
Dev - Nodemon: https://nodemon.io/
