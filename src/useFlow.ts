import { useState } from "react";

export type BaseState = Record<string, unknown>;
export type Pendable<T extends BaseState> = {
  [K in keyof T]: T[K] | Promise<T[K]>;
};

type Flow<S extends BaseState> = {
  [K in keyof S]: Promise<S[K]>;
};

export function isPromise<T>(p: T | Promise<T>): p is Promise<T> {
  return p instanceof Promise;
}

/**
 * Cancellable (detach-able) Flow runner.
 */
class FlowRunner<T extends BaseState> {
  detached = false;
  constructor(
    flow: Flow<T>,
    setState: React.Dispatch<React.SetStateAction<Pendable<T>>>
  ) {
    for (const _k of Object.keys(flow)) {
      // Type trick (`Object.keys`'s limitation).
      const k = _k as keyof typeof flow;
      flow[k].then((newPropertyValue) => {
        if (this.detached) return;
        // Promise -> Value
        setState((state) => ({ ...state, [k]: newPropertyValue }));
      });
    }
    // reset with all pending state
    setState(flow);
  }
  detach(): void {
    this.detached = true;
  }
}

/**
 * React hook for "flow", a set of state transition (~ transaction).
 * `setFlow` cancel old flow, so declarative state expression is possible.
 *
 * @param initialState - Default state value.
 * @returns - [current state, flow setter/replacer]
 */
export function useFlow<T extends BaseState>(
  initialState: T
): [Pendable<T>, (flow: Flow<T>) => void] {
  const [state, setState] = useState<Pendable<T>>(initialState);
  const [oldAsyncFlowManager, setFlowManager] = useState<FlowRunner<T>>();
  const setFlow = (flow: Flow<T>) => {
    oldAsyncFlowManager?.detach();
    const newFlowManager = new FlowRunner(flow, setState);
    setFlowManager(newFlowManager);
  };
  return [state, setFlow];
}
