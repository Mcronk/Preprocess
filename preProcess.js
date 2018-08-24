
const readChunk = require('read-chunk');
const fileType = require('file-type');
const vorpal = require('vorpal')();



var stt_content_types = [
      'audio/basic',            //(Use only with narrowband models.)
      'audio/flac',
      'audio/l16',              //(Specify the sampling rate (rate) and optionally the number of channels (channels) and endianness (endianness) of the audio.)
      'audio/mp3',
      'audio/mpeg',
      'audio/mulaw',            //(Specify the sampling rate (rate) of the audio.)
      'audio/ogg',              //(The service automatically detects the codec of the input audio.)
      'audio/ogg;codecs=opus',
      'audio/ogg;codecs=vorbis',
      'audio/wav',              //(Provide audio with a maximum of nine channels.)
      'audio/webm',             //(The service automatically detects the codec of the input audio.)
      'audio/webm;codecs=opus',
      'audio/webm;codecs=vorbis'
];

vorpal
  .command('process <filepath>', 'Processes [filepath].')
  .alias('p')
  .action(function(args, callback) {
    console.log(args['filepath']);
    getFileType(args['filepath'])



    //check fileType
      //check audioformat
        //prompt user to adjust format.
      //check audiosampling
        //prompt user to adjust sampling
      //check filesize
        //prompt user to split into pieces


    callback();
  });

vorpal
  .delimiter('Y$')
  .show();


/**

Returns filetype based on file buffer magic number.
https://en.wikipedia.org/wiki/Magic_number_(programming)#Magic_numbers_in_files
*/
function getFileType(filepath) {
  const buffer = readChunk.sync(filepath, 0, 4100);
  console.log(fileType(buffer));
};


/**


if audio file type of (mp3, mp4, wav, ma4)
returns audio size
//MAX is 100mb per request (INCLUDING STREAMS)
*/
function getSize() {
  return "";
};

/**


splits audio into X sized chunks for STT processing
//https://www.npmjs.com/package/ffmpeg
*/
function splitAudio() {
  return "";

};

/**



Changes sampling for Broadband/Narrowband
**From audio format docs**
    For broadband models, the service converts audio recorded at higher sampling rates to 16 kHz.
    For narrowband models, it converts the audio to 8 kHz.
*/
function adjustSampling() {
//https://github.com/xdissent/node-resampler

}

/**

Extracts audio from video types
https://www.npmjs.com/package/ffmpeg
*/
function extractAudio() {


}

/**


Switches audio to mp3 filetype.
*/
function changeAudio() {
  return "";
};
