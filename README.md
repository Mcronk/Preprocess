
Will start the CLI
start: npm start

Will automatically re-run on each save of preProcess.js
dev: npm run dev


Commands:
check       (-c)   Checks for STT compatibility on audio file size, duration, sample rate, and MIMEtype.
preprocess  (-)   Augments files or directories of files for STT compatibility on audio file size, duration, sample rate, and MIMEtype.
split       (-s)   Splits audio files over 100MB and outputs the resulting paths.       


TODO:  
Switch preprocess pipeline to run on directories of files
Split large files
Do we change from narrowband to broadband to accomodate arabic?
Separate video audio and all the other audioSize
//writes a file that maintains the linkage between the audio file and video file


//FLAC if space permits for lossless.
//MP3 if we can afford slight compression.

CLI - Vorpal: https://github.com/dthree/vorpal
Dev - Nodemon: https://nodemon.io/
