
const readChunk = require('read-chunk');
const fileType = require('file-type');
const ffmpeg = require('ffmpeg');
const async = require('async');

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

var stt_extra_processing = [
      'audio/basic'             : 'Use only with narrowband models.',
      'audio/flac',             : '',
      'audio/l16',              : 'Specify the sampling rate (rate) and optionally the number of channels (channels) and endianness (endianness) of the audio.',
      'audio/mp3',              : '',
      'audio/mpeg',             : '',
      'audio/mulaw',            : 'Specify the sampling rate (rate) of the audio.',
      'audio/ogg',              : 'The service automatically detects the codec of the input audio.',
      'audio/ogg;codecs=opus',  : '',
      'audio/ogg;codecs=vorbis',: '',
      'audio/wav',              : 'Provide audio with a maximum of nine channels.',
      'audio/webm',             : 'The service automatically detects the codec of the input audio.',
      'audio/webm;codecs=opus', : '',
      'audio/webm;codecs=vorbis': '',
];


var fileMetadata = {
  'Filename'  : '',
  'MIMEType'  : '',
  'Size'      : '',
  'SampleRate': '',
  'Channels'  : '',
  'BitRate'   : '',
  'Filename'  : '',
  'Video'     : 'False',  //Was the audio originally part of a video
  'Split'     : 'False',  //Was the audio split into smaller files
  'Actions'   : []        //PreProcessor Actions

}

vorpal
  .command('process <filepath>', 'Processes [filepath].')
  .alias('p')
  .action(function(args, callback) {
    // console.log(args['filepath']);

  preProcess(args);



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


function preProcess(args) {
  function returnArgs() {//temporary getter.
    return args;
  }

  async.waterfall([
      function processFiletype(callback) {
        var args = returnArgs();
        console.log(args);
        var filePath = args['filepath'];



//******DELETE ME AFTER DEV****************
        filePath = '/Users/michaelcronk/Desktop/audio.mp3'

        getFileType(filePath, function (fileType) {//Get filetype
          if (stt_content_types.indexOf(fileType) > -1) {//If filetype is STT compatible, move to next stage
            console.log("Compatible MIMEtype detected: " + fileType);
            callback(null, filePath);
          } else if (fileType.substring(0,5) == 'video') {//if filetype is a video, extract mp3 audio and move to next stage
            console.log("Video MIMEtype detected: " + fileType);

            extractAudio(filePath, function(err, newPath) {
              if (err) {
                callback(err);//if extractAudio returns an error, propogate it to the end of the waterfall.
              }
              console.log("Mp3 extracted at: " + newPath);
              callback(null, newPath);
            });//end extractAudio
          } else {//if the filetype is not STT compatible or a video with audio we can extract, abort.
            console.log("Incompatible filetype detected.  Aborting");
            callback(new Error("Incompatible filetype detected: " + fileType));
          }
        });//end getFileType

    }//end processFiletype

  ], function (err, results) {
    if (err) {
      console.log(err);
    }
    console.log("Pre-process results path: " + results);
  });//end async.waterfall




}


/**

Returns filetype based on file buffer magic number.
https://en.wikipedia.org/wiki/Magic_number_(programming)#Magic_numbers_in_files
*/
function getFileType(filepath, callback) {
  const buffer = readChunk.sync(filepath, 0, 4100);
  var type = fileType(buffer);
  callback(type['mime']);
};
/**
Extracts audio from video types
https://www.npmjs.com/package/ffmpeg
*/
function extractAudio(filePath, callback) {
  console.log("Beginning audio extraction.");
  try {
  	var process = new ffmpeg(filePath);
  	process.then(function (video) {

      var mp3Path = filePath.split('.').slice(0, -1).join('.') + 'mp3';//replaces extension wth mp3
  		video.fnExtractSoundToMP3(mp3Path, function (error, file) {
  			if (!error)
  				console.log('Audio file: ' + mp3Path);
          callback(null, mp3Path);
  		});
  	}, function (err) {
      console.log('extractAudio fnExtractSoundToMP3 handler: Cannot extract audio, aborting.');
  		callback(err);
  	});
  } catch (e) {
    console.log('extractAudio catch: Cannot extract audio, aborting.');
    callback(e);

  }

}






//check sampling rates
function checkSamplingRate(filepath) {

//This is really tough

}
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
