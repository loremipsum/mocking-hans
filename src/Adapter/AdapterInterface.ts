import {Container} from '../Utility';

export interface AdapterInterface {
  register(app: object, container: Container);

  configure(cb: (container: Container) => void);
}
