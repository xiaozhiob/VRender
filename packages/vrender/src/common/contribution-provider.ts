import { interfaces } from 'inversify';

export const ContributionProvider = Symbol('ContributionProvider');

export interface ContributionProvider<T> {
  getContributions: () => T[];
}

class ContributionProviderCache<T> implements ContributionProvider<T> {
  protected caches?: T[];
  protected serviceIdentifier: interfaces.ServiceIdentifier<T>;
  protected container: interfaces.Container;

  constructor(serviceIdentifier: interfaces.ServiceIdentifier<T>, container: interfaces.Container) {
    this.serviceIdentifier = serviceIdentifier;
    this.container = container;
  }

  getContributions(): T[] {
    if (!this.caches) {
      this.caches = [];
      this.container && this.caches.push(...this.container.getAll(this.serviceIdentifier));
    }
    return this.caches;
  }
}

export function bindContributionProvider(bind: interfaces.Bind, id: any): void {
  bind(ContributionProvider)
    .toDynamicValue(({ container }) => new ContributionProviderCache(id, container))
    .inSingletonScope()
    .whenTargetNamed(id);
}
