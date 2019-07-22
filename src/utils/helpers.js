import imagesLoaded from 'imagesloaded';

export const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));

export const waitForImagesToLoad = el => new Promise(resolve => imagesLoaded(el, resolve));
