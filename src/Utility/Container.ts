export class Container {
  protected elements: Map<string, any> = new Map<string, any>();

  public set(id: string, obj: object) {
    this.elements.set(id, obj);
  }

  public get(id: string) {
    return this.elements.get(id);
  }

  public has(id: string) {
    return this.elements.has(id);
  }
}
