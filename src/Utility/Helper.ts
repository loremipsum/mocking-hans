export class Helper {
  public static getRandomElementByProbability(elements: Array<{ element: any, probability: number }>) {
    let rnd = Math.random();
    let index = elements.length - 1;

    elements.some((e, i) => {
      if (rnd < e.probability) {
        index = i;
        return true;
      }
      rnd -= e.probability;
    });

    return elements[index];
  }
}
