
const readChunk = require('read-chunk');
const fileType = require('file-type');
const ffmpeg = require('ffmpeg');
const async = require('async');
const fs = require("fs");
//const load = require('audio-loader')
const vorpal = require('vorpal')();
const split = require('audio-split');
const splitFile = require('split-file');
const ffprobe = require('ffprobe')
const ffprobeStatic = require('ffprobe-static');


const stt_content_types = [
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

const stt_extra_processing = {
      'audio/basic'             : 'Use only with narrowband models.',
      'audio/flac'             : '',
      'audio/l16'              : 'Specify the sampling rate (rate) and optionally the number of channels (channels) and endianness (endianness) of the audio.',
      'audio/mp3'              : '',
      'audio/mpeg'            : '',
      'audio/mulaw'            : 'Specify the sampling rate (rate) of the audio.',
      'audio/ogg'              : 'The service automatically detects the codec of the input audio.',
      'audio/ogg;codecs=opus'  : '',
      'audio/ogg;codecs=vorbis': '',
      'audio/wav'              : 'Provide audio with a maximum of nine channels.',
      'audio/webm'             : 'The service automatically detects the codec of the input audio.',
      'audio/webm;codecs=opus' : '',
      'audio/webm;codecs=vorbis': '',
};

/**

files = {

./Users/michael/file.mp3 : fileMetadata,
./Users/michael/file.mp3 : fileMetadata,
./Users/michael/file.mp3 : fileMetadata,
./Users/michael/file.mp3 : fileMetadata,

}

*/
const fileMetadata = {
  'Filename'  : '',
  'MIMEType'  : '',
  'Size'      : '',
  'SampleRate': '',
  'Channels'  : '',
  'BitRate'   : '',
  'Filename'  : '',
  'Video'     : 'False',  //Was the audio originally part of a video
  'Split'     : 'False',  //Was the audio split into smaller files
  'Actions'   : [],        //PreProcessor Actions
  'Success'   : 'False',
  'Error'     : 'None'

}

vorpal
  .command('process <filepath>', 'Processes [filepath].')
  .alias('p')
  .action(function(args, callback) {
    // console.log(args['filepath']);

  preProcess(args);

    callback();
  });

vorpal
  .command('check <filepath>', 'Retrieves basic data on [filepath].')
  .alias('c')
  .action(function(args, callback) {
    // console.log(args['filepath']);
  check(args);

    callback();
  });

  vorpal
    .command('split <filepath>', 'Splits files over 100MB.')
    .alias('s')
    .action(function(args, callback) {
      // console.log(args['filepath']);
      var filePath = args['filepath'];


      filePath = '/Users/michaelcronk/Desktop/audio.mp3';


      splitAudio(filePath);

      callback();
    });

vorpal
  .delimiter('Y$')
  .show();


function check(args) {

  var filePath = args['filepath'];
        filePath = '/Users/michaelcronk/Desktop/mkv.mkv';

  getFileType(filePath, function (fileType) {//Get filetype
    console.log("\x1b[0m","MIMEtype: " + fileType);
    if (stt_content_types.indexOf(fileType) > -1) {
      console.log("\x1b[32m","MIMEtype OKAY.");
      var audioSize = getMB(filePath);
      if (audioSize >= 100) {
      console.log('\x1b[31m', "Audio file size exceeds 100mb.  Audio split necessary.");
      }
      else {
        console.log('\x1b[0m',"Audio size: " + audioSize);
        console.log('\x1b[32m',"Audio size OKAY.");
      }


      getAudioInfo(filePath, function(err, info) {
        if (err) {
          callback(err);
        }
        var duration = info['streams'][0]['duration'];
        var sampleRate = info['streams'][0]['sample_rate'];
        //var bitRate = info['streams'][0]['bit_rate:'];

        console.log('\x1b[0m', "Audio duration: " + duration);
        if (duration >= 3300) {
          console.log('\x1b[31m', "Audio duration exceeds 3300 seconds.  Audio split necessary.");

        } else {
          console.log("\x1b[32m","Audio duration OKAY.");
        }


        console.log('\x1b[0m', "Audio sample rate: " + sampleRate);
        if (sampleRate >= 8000 && sampleRate <= 16000) {
          console.log('\x1b[33m', "Audio is in model.  Arabic STT restricted unless switched to broadband.");
        }
        if (sampleRate >= 16000) {
          console.log("\x1b[0m","Audio is in broadband, no STT model restrictions.");
          console.log("\x1b[32m","Audio sample rate OKAY.");

        }
        console.log('\x1b[0m', "\n **Check complete**");
      })
        //print audio sized (will it need to be broken into pieces?)
        //print audio duration
        //print audio sample rate (broadband vs narrowband)
        //print audio bit rate.
    } else if (fileType.substring(0,5) == 'video') {
      console.log("Video MIMEtype detected: " + fileType);
      console.log('\x1b[31m', "Audio extraction necessary.")
    } else {//if the filetype is not STT compatible or a video with audio we can extract, abort.
      console.log('\x1b[31m',"Incompatible filetype detected.  Aborting.");
    }

    console.log('\x1b[0m', "\n **Check complete**");

  });

};//end check



function preProcess(args) {
  function returnArgs() {//temporary getter.
    return args;
  }

  async.waterfall([
      function processFiletype(callback) {
        var args = returnArgs();
        console.log(args);
        var filePath = args['filepath'];
        var files = {};



//******DELETE ME AFTER DEV****************
        filePath = '/Users/michaelcronk/Desktop/mkvmp3.mp3';

        //for each file



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

    },//end processFiletype

    function checkAudioFormat(filePath, callback) {

      if (getMB(filePath) >= 100) {
        splitAudio(filePath);
      }
      getAudioInfo(filePath, function(err, info) {
        if (err) {
          callback(err);
        }
        console.log(info);
        //adjust sampling rate
        //adjust bit rate
        callback(null, info);

      });




    }

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
Returns path to mp3
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


/**
Returns an object of audio information
{ streams:
  [ { index: 0,
      codec_name: 'mp3',
      codec_long_name: 'MP3 (MPEG audio layer 3)',
      codec_type: 'audio',
      codec_time_base: '1/44100',
      codec_tag_string: '[0][0][0][0]',
      codec_tag: '0x0000',
      sample_fmt: 's16p',
      sample_rate: '44100',
      channels: 2,
      channel_layout: 'stereo',
      bits_per_sample: 0,
      r_frame_rate: '0/0',
      avg_frame_rate: '0/0',
      time_base: '1/14112000',
      start_pts: 353600,
      start_time: '0.025057',
      duration_ts: 2035998720,
      duration: '144.274286',
      bit_rate: '128000',
      disposition: [Object],
      tags: [Object] } ] }

*/
function getAudioInfo(filePath, callback) {
  ffprobe(filePath, { path: ffprobeStatic.path }, function (err, info) {
    if (err) {
      callback("getAudioInfo Error: " + err);
    }
    callback(null, info);
  });
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
function getMB(filePath) {
    var stats = fs.statSync(filePath);
    return stats.size/1000000;
}
/**


splits audio into X sized chunks for STT processing
//Updates metadata object for the file.
//https://www.npmjs.com/package/ffmpeg
*/
function splitAudio(filePath) {
  splitFile.splitFileBySize(filePath, 1000000)
    .then((names) => {
      console.log(names);
    })
    .catch((err) => {
      console.log('Error: ', err);
    });
};
