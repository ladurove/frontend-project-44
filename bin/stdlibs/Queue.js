class MutableQueueImpl {
  list = [];

  listListeners = [];

  push(value) {
    this.list.push(value);
    this.listListeners.forEach((callback) => callback(value));
    this.listListeners.splice(0, this.listListeners.length);
  }

  unshift(value) {
    this.list.unshift(value);
    this.listListeners.forEach((callback) => callback(value));
    this.listListeners.splice(0, this.listListeners.length);
  }

  next() {
    if (this.list.length > 0) { return Promise.resolve(this.list.shift()); }
    return new Promise((resolve) => {
      this.listListeners.push((value) => resolve(value));
    });
  }
}

export default function MutableQueue() {
  return new MutableQueueImpl();
}
