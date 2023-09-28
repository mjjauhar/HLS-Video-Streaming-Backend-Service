import { HttpException } from '@nestjs/common';
import * as ffprobe from 'ffprobe';
import * as ffprobeStatic from 'ffprobe-static';

export async function getDetailedVideoInfo(videoPath) {
  try {
    return await ffprobe(videoPath, {
      path: ffprobeStatic.path,
    });
  } catch (error) {
    return error;
  }
}

// getDetailedVideoInfo(
//   'https://adamdoctorapp.s3.ap-south-1.amazonaws.com/adamdoctorapp/adamacademy/courses/2e606cdd-1770-4923-a913-eab931eea3d7-test_course.mp4',
// )
//   .then(function (info) {
//     console.log(info.streams[0].duration);
//   })
//   .catch(function (err) {
//     console.error(err);
//   });
