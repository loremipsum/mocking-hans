import 'reflect-metadata';
import {MetadataKey} from './Model';
import {Metadata, State, Type} from './Utility';
import chalk from 'chalk';
import {AdapterInterface} from './Adapter';
import {Container} from './Utility/Container';

// Let's be honest here: I've always wanted to name a class "Hans".
export class Hans {
  private appInstances: Map<string, object> = new Map<string, object>();

  /**
   * Hans-wide state, shared across all applications; will be injected to application constructors as first argument.
   */
  private state: State = new State();

  constructor(protected apps: Array<{ new(...args: any[]) }>) {
  }

  public async bootstrap() {
    if (this.apps.length === 0) {
      // tslint:disable-next-line
      console.error('Nothing to mock. Farewell, friend.');
    }

    this.apps.forEach((app) => {
      const port          = Metadata.get<string>(app, MetadataKey.Port);
      const name          = Metadata.get<string>(app, MetadataKey.Name);
      const adapters      = Metadata.get<Array<Type<AdapterInterface>>>(app, MetadataKey.Adapter);
      const configuration = Metadata.get<() => void>(app, MetadataKey.Configuration);
      const container     = new Container();

      container.set(name, this.getAppInstance(app));

      if (!Array.isArray(adapters) || adapters.length === 0) {
        // tslint:disable-next-line
        console.error(`${chalk.red.bold(`\t ERROR: No adapters found for ${name}`)}`);
        return;
      }

      adapters.forEach(adapter => {
        const adapterInstance = new adapter();
        adapterInstance.register(app, container);
        adapterInstance.configure(configuration);
      });

      // tslint:disable-next-line
      console.info(`\t✔️  Started ${chalk.underline(name)} on localhost:${chalk.bold(port)}`);
    });
  }

  private getAppInstance(app: { new(...args: any[]) }) {
    const name = Reflect.getMetadata(MetadataKey.Name, app);

    if (!this.appInstances.has(name)) {
      this.appInstances.set(name, new app(this.state));
    }

    return this.appInstances.get(name);
  }
}
