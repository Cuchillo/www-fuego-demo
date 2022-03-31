export default class CustomLoader {
    id;
    onFileLoaded;
    onProgress;
    onComplete;
    itemsTotal;
    itemsLoaded;
    errors;
    progress;
    isBackground = false;

    constructor(){};
    init(){}
    cancel(){}
    reset(){}
    dispose(){}
}
