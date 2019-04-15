import {Container} from '../Utility/Container';

export interface AdapterInterface {
  register(app: object, container: Container);

  configure(cb: (container: Container) => void);
}
