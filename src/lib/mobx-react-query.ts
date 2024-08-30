import { QueryObserver, QueryObserverOptions, QueryClient, QueryKey, DefaultError } from '@tanstack/query-core';
import { computed, createAtom, makeObservable, reaction } from 'mobx';

export class MobxQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> {
  private atom = createAtom(
    'MobxQuery',
    () => this.startTracking(),
    () => this.stopTracking()
  );

  private queryObserver = new QueryObserver(this.queryClient, this.getOptions());

  constructor(
    private getOptions: () => QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>,
    private queryClient: QueryClient
  ) {
    makeObservable(this, {
      data: computed,
    });
  }

  fetch() {
    return this.queryClient.fetchQuery(this.defaultedQueryOptions);
  }

  get result() {
    this.atom.reportObserved();
    this.queryObserver.setOptions(this.defaultedQueryOptions);
    return this.queryObserver.getOptimisticResult(this.defaultedQueryOptions);
  }

  get data() {
    const data = this.result.data;

    if (!data) {
      throw this.queryObserver.fetchOptimistic(this.defaultedQueryOptions);
    }

    return data;
  }

  private unsubscribe() {}

  private startTracking() {
    const unsubscribeReaction = reaction(
      () => this.defaultedQueryOptions,
      () => this.queryObserver.setOptions(this.defaultedQueryOptions)
    );

    const unsubscribeObserver = this.queryObserver.subscribe(() => this.atom.reportChanged());

    this.unsubscribe = () => {
      unsubscribeObserver();
      unsubscribeReaction();
    };
  }

  private stopTracking() {
    this.unsubscribe();
  }

  private get defaultedQueryOptions() {
    return this.queryClient.defaultQueryOptions(this.getOptions());
  }
}
