export default class LoaderController {
  static onComplete;
  static onUpdate;
  static itemsTotal = 0;
  static itemsLoaded = 0;
  static _loaders = {};
  static progress = 0;

  static get type () { return LoaderController._type }

  static reset () {
    for (var a in LoaderController._loaders) {
      if (LoaderController._loaders[a] != null) {
        LoaderController._loaders[a].cancel();
        LoaderController._loaders[a].reset();
      }
    }

    LoaderController.progress = 0;
    LoaderController.itemsTotal = 0;
    LoaderController.itemsLoaded = 0;
  }

  static add (__loader) {
    LoaderController.itemsTotal += 1;
    LoaderController._loaders[__loader.id] = __loader;
  }

  static remove (__loader) {
    for (var a in LoaderController._loaders) {
      if (a === __loader.id) {
        LoaderController._loaders[a].dispose();
        LoaderController._loaders[a] = null;
        LoaderController.itemsTotal--;
      }
    }
  }

  static init () {
    for (var a in LoaderController._loaders) {
      if (LoaderController._loaders[a] != null && !LoaderController._loaders.isBackground) {
        LoaderController._loaders[a].onFileLoaded = LoaderController.fileLoaded;
        LoaderController._loaders[a].onProgress = LoaderController.onProgress;
        LoaderController._loaders[a].onComplete = LoaderController.end;
        LoaderController._loaders[a].init();
      }
    }
  }

  static end () {

    let allLoad = true;
    for (var a in LoaderController._loaders) {
      if (LoaderController._loaders[a] != null) {
        if (LoaderController._loaders[a].progress < 1) {
          allLoad = false;
          break;
        }
      }
    }

    if (LoaderController.onComplete && allLoad) {
      LoaderController.onComplete();
      LoaderController.onComplete = null;
    }
  }

  static onProgress () {
    let _p = 0;
    let _c = 0;

    for (var a in LoaderController._loaders) {
      if (LoaderController._loaders[a] != null && !LoaderController._loaders.isBackground) {
        _p += LoaderController._loaders[a].progress;
        _c++;
      }
    }

    LoaderController.progress = _p / _c;

    if (LoaderController.onUpdate) LoaderController.onUpdate(LoaderController.progress);
  }

  static fileLoaded () {
    LoaderController.itemsLoaded++;
  }
}
