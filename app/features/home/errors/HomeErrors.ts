class HomeFeatureError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HomeFeatureError";
  }
}

export { HomeFeatureError };
