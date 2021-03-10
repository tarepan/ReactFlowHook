# FlowHook - React hook for consistent state transition
`useFlow` is React Hook for "flow", a set of state transition (~ transaction).  
It works similar to React **suspense for data fetch**, but more simple.  
With `useFlow`, you can avoid accidental *lost update* and *inconsistence between components*.  

## How to use/works
Very similar to `useState`, but quite safe!  

```tsx
// a "flow", single set of state transitions written with `Promise`.
export const fetchProfile = (userId: UserId) => ({
  userId: Promise.resolve(userId), // Promise<number>
  user: fetchUser(userId), // Promise<{name: string}>
  posts: fetchPosts(userId), // Promise<Post[]>
});

// <App>
export const App: FC = () => {
  // `state` is automatically and consistently updated by Flow hook.
  const [state, setFlow] = useFlow({userId: -1, user: { name: "-" }, posts: []});
  return (
    <>
      {/* Update state with asynchronous data fetches. */}
      <button onClick={() => setFlow(fetchProfile(1))} />
      {/* Show data. */}
      <ProfilePage state={state} />
    </>
  );
};

// <ProfilePage>
export const ProfilePage: FC<{ state: Pendable<Profile> }> = (prop) => {
  // `.user` is fetched `string` or ongoing `Promise<string>`.
  if (isPromise(prop.state.user)) {
    return <p>Loading profile...</p>;
  }
  return (
    <>
      <h1>{prop.state.user.name}</h1>
      <ProfileTimeline posts={prop.state.posts} />
    </>
  );
};
```

## What is benefit?
Avoid *Lost Update* and *Inconsistence between components*.  

`useState` with `useEffect` for data fetch has common pitfall.  
It is above two problems (in detail, check [*Suspense for Data Fetching*](https://reactjs.org/docs/concurrent-mode-suspense.html) in React official).  
It is caused by **manually-controlled concurrent state update flow**.  
One *flow* update a state, but the other *flow* overwrite the state, then results in *Lost Update*.  
One *flow* update a part of state, but the other *flow* not yet update other parts, then results in *Inconsistence between components*.  

This hook, `useFlow`, control flows automatically!  
What you needs is only **declaring which flow should be active now!**  
By `setFlow()`, an old flow is cancelled implicitly, no fear of *Lost Update*.  
`setFlow()` accept multi-part flow, all parts of a state is always *consistent*.  

## Demo
Run `npm start`, then get features equivalent to [*Suspense for Data Fetching*](https://reactjs.org/docs/concurrent-mode-suspense.html).  

## How to Install
Not yet packaged,  
but simply copying a [`useFlow` file](https://github.com/tarepan/ReactFlowHook/blob/main/src/useFlow.ts) is enough! (only 60 lines of code, tiny!)  