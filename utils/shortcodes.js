const fs = require('fs');
const path = require('path');
const { outdent } = require('outdent');
const Image = require('@11ty/eleventy-img');
const markdown = require('./markdown');

const langs = require('../src/_data/locales');
const site = require('../src/_data/_site');

const iconDefaultSize = 24;
const defaultSizes = '90vw';
const defaultImagesSizes = [1920, 1280, 640, 320];

const isFullUrl = (url) => {
  try {
    return !!new URL(url);
  } catch {
    return false;
  }
};

const manifestPath = path.resolve(__dirname, '../_site/assets/manifest.json');


module.exports = {
  lang: async (locale, s) => {
    const loc = locale? locale : langs.default;
    const text = langs[loc][s];
    return text? text : "Translate missing";
  },

  // Allow embedding markdown in `.njk` files
  // {% markdown %}
  // # Heading
  // {% endmarkdown %}
  markdown: (content) => markdown.render(outdent.string(content)),
  // Allow embedding webpack assets pulled out from `manifest.json`
  // {% webpack "main.css" %}
  webpack: async (name) =>
    new Promise((resolve) => {
      fs.readFile(manifestPath, { encoding: 'utf8' }, (err, data) =>
        resolve(err ? `/assets/${name}` : JSON.parse(data)[name])
      );
    }),

  // Allow embedding svg icon
  // {% icon "github.svg", "my-class", [24, 24] %}
  icon: (name, className, size = iconDefaultSize) => {
    if (!Array.isArray(size)) size = [size];
    return outdent({ newline: '' })`
    <svg class="icon icon--${name} ${
      className || ''
    }" role="img" aria-hidden="true" width="${size[0]}" height="${
      size[1] || size[0]
    }">
      <use xlink:href="/assets/images/sprite.svg#${name}"></use>
    </svg>`;
  },

  // Allow embedding svg icon
  // {% icon "github.svg", "my-class", [24, 24] %}
  svg: (name, size = iconDefaultSize) => {
    if (!Array.isArray(size)) size = [size];
    return outdent({ newline: '' })`
        <svg role="img" aria-hidden="true" viewBox="0 0 ${size[0]} ${size[1] || size[0]}">
            <use xlink:href="/assets/images/sprite.svg#${name}"></use>
        </svg>`;
  },

  // Imagenes para redes sociales.
  // Se guardan en assets/social y devuelve la ruta completa
  // No se modifica el tamaño, ya deberia venir bien desde WP
  social: async (...args) => {
    const src = args[0];

    if (src) {
      if(src.indexOf(site.url) > -1) {
        return src;
      } else {
        const fullSrc = isFullUrl(src) ? src : `./src/assets/images/${src}`;

        stats = await Image(fullSrc, {
          widths: [null],
          formats: ['jpeg'],
          urlPath: `/assets/social/`,
          outputDir: '_site/assets/social/'
        });

        return site.url + Object.values(stats)[0][0].url;
      }
    }
  },

  img: (image, opts={}) => {
    /* Los svgs desde WP pueden llegar con altura 1, los ponemos con un aspect 1:1 */
    const aspect = image.sizes["@1x-height"] <= 2 ? 1 : image.sizes["@1x-height"]/image.sizes["@1x-width"];
    const atrImg = opts.attrImage? opts.attrImage : "";
    const atrFig = opts.attrFigure? opts.attrFigure : "";
    const loading = opts.loading? opts.loading : "lazy";
    const loadType = opts.preload? "data-item-preload" : "data-item-load";
    const figcaption = opts.figcaption? `<figcaption>${opts.figcaption}</figcaption>` : "";

    return outdent({ newline: '' })`
        <figure class='media-holder' ${atrFig} style="--aspect: ${aspect}">
           <img ${loadType}
           ${atrImg}
           loading="${loading}"
           alt="${image.title}"
           src="/assets/images/blank.png"
           data-src="
            ${image.sizes["@1x"]},
            ${image.sizes["@2x"]},
            ${image.sizes["@3x"]},
            ${image.sizes["@4x"]}"
           width="${image.sizes["@1x-width"]}"
           height="${image.sizes["@1x-height"]}">
           ${figcaption}
        </figure>`;
  },

  video: (video, image, hasLoop = true) => {
    const aspect = image.sizes["@1x-height"]/image.sizes["@1x-width"];
    const loop = hasLoop? "loop" : "";
    return outdent({ newline: '' })`
        <figure class='media-holder' style="--aspect: ${aspect}">
          <video data-autoplay
            data-item-load
            muted
            ${loop}
            playsinline
            webkit-playsinline
            preload="none"
            poster="/assets/images/blank.png"
            data-src="
            ${image.sizes["@1x"]},
            ${image.sizes["@2x"]},
            ${image.sizes["@3x"]},
            ${image.sizes["@4x"]}"
            width="${image.sizes["@1x-width"]}"
            height="${image.sizes["@1x-height"]}"
            src="${video}"></video>
        </figure>`;
  },


  image: async (...args) => {
    let fallbackWidth, fallbackHeight;

    if (Array.isArray(args[0])) {
      [fallbackWidth, fallbackHeight] = args.shift();
    }

    const src = args[0];
    const alt = args[1];
    const title = args[2];
    const className = args[3];
    const lazy = args[4] ?? true;
    const sizes = args[5] ?? defaultSizes;

    const extension = path.extname(src).slice(1).toLowerCase();
    const fullSrc = isFullUrl(src) ? src : `./src/assets/images/${src}`;

    let stats;
    try {
      stats = await Image(fullSrc, {
        widths: defaultImagesSizes,
        formats: extension === 'webp' ? ['webp', 'jpeg'] : ['webp', extension],
        urlPath: '/assets/images/',
        outputDir: '_site/assets/images/'
      });
    } catch (e) {
      console.log('\n\x1b[31mERROR\x1b[0m creating image:');
      console.log(`> (${fullSrc})`);
      console.log(`  ${e}\n`);
      return '';
    }

    const fallback = stats[extension].reverse()[0];
    const picture = outdent({ newline: '' })`
    <picture>
      ${Object.values(stats)
      .map(
        (image) =>
          `<source type="image/${image[0].format}" srcset="${image
            .map((entry) => `${entry.url} ${entry.width}w`)
            .join(', ')}" sizes="${sizes}">`
      )
      .join('')}
      <img
        class="${className ? `img-${className}` : ''}"
        loading="${lazy ? 'lazy' : 'eager'}"
        src="${fallback.url}"
        width="${fallbackWidth ?? fallback.width}"
        height="${fallbackHeight ?? fallback.height}" alt="${alt}">
    </picture>`;
    return title
      ? outdent({ newline: '' })`
      <figure class="${className ? `fig-${className}` : ''}">
        ${picture}
        <figcaption>${markdown.renderInline(title)}</figcaption>
      </figure>`
      : picture;
  }
};
