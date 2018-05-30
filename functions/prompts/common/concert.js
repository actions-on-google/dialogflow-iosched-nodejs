// Copyright 2018, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const {
  BrowseCarouselItem,
  BrowseCarousel,
  Image,
} = require('actions-on-google');

/* eslint-disable max-len*/
const getYouTubeURL = (videoId) => {
  return `https://www.youtube.com/watch?v=${videoId}`;
};

const getYouTubeThumbnail = (videoId) => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

const carouselSong = (title, videoId) => {
  return new BrowseCarouselItem({
    title: title,
    url: getYouTubeURL(videoId),
    image: new Image({
      url: getYouTubeThumbnail(videoId),
      alt: title,
    }),
  });
};

exports.popularJusticeSongsCarousel = () => {
  return new BrowseCarousel(
    carouselSong(`Justice - Genesis - †`, `VKzWLUQizz8`),
    carouselSong(`Justice - D.A.N.C.E. - †`, `tCnBrrnOefs`),
    carouselSong(`Justice - Phantom Pt II - †`, `5QCBkwmsOk0`),
    carouselSong(`Justice - Let There Be Light - †`, `_0-tWLi0Kp4`)
  );
};

exports.popularPhantogramSongsCarousel = () => {
  return new BrowseCarousel(
    carouselSong(`Phantogram "When I'm Small"`, `28tZ-S1LFok`),
    carouselSong(`Phantogram - You Don’t Get Me High Anymore`, `jryzEU7WAlg`),
    carouselSong(`Phantogram - Fall In Love`, `RsQjC5zVnt8`),
    carouselSong(`Phantogram - Same Old Blues (Official Audio)`, `WcS6MA9fu-I`)
  );
};
