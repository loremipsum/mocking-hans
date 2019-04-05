export class State {
  private state: Map<string, any> = new Map<string, any>();

  public get(key: string, fallback: any = undefined) {
    if (! this.has(key)) {
      return fallback;
    }

    return this.state.get(key);
  }

  public has(key: string) {
    return this.state.has(key);
  }

  public set(key: string, value: any) {
    this.state.set(key, value);
  }

  public delete(key: string) {
    this.state.delete(key);
  }
}
