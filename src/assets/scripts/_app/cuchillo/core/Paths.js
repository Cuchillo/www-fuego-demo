const CDN = document.body.getAttribute("data-cdn");
const Paths = {
  assets: CDN + "/assets/",
  images: CDN + "/assets/images/",
  textures: CDN + "/assets/textures/",
  videos: CDN + "/assets/videos/",
  svg: CDN + "/assets/svg/",
};

export { CDN, Paths }
