#!/bin/bash
# the shell script to trigger the webhook on sucessful execution
# of video transcoding using ffmpeg

# scan for valid directory argument to be sent via command line
# which represents the name of the directory with transcoded content
# of the video.
# the input will be of the format 
# ./curl_transcoding_finished.sh -directory "ID_OF_VIDEO_FOLDER"
VIDEO_DIRECTORY="$1"
LECTURE_ID="$2"
TITLE="$3"
DESCRIPTION="$4"
USER_ID="$5"

echo "$VIDEO_DIRECTORY"
echo "$LECTURE_ID"
echo "$TITLE"
echo "$DESCRIPTION"
echo "$USER_ID"

curl http://127.0.0.1:3000/api/videos/aws/$VIDEO_DIRECTORY/$LECTURE_ID/$TITLE/$DESCRIPTION/$USER_ID