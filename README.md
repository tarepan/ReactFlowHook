# FlowHook - React hook for consistent state transition
`useFlow` is React Hook for "flow", a set of state transition (~ transaction).  
It works very similar to React official's **suspense for data fetch**.  
With `useFlow`, you can avoid accidental *lost update* and *inconsistence between components*.  

## How to use/works
Very similar to `useState`, but quite safe!  

```tsx
// a set of state transition (3 independent async data fetch)
export const fetchProfile = (userId: UserId) => ({
  userId: Promise.resolve(userId),
  user: fetchUser(userId),
  posts: fetchPosts(userId),
});

// <App>
export const App: FC = () => {
  const [state, setFlow] = useFlow({userId: -1, user: { name: "-" }, posts: []});
  return (
    <>
      {/* Update state with asynchronous data fetch */}
      <button onClick={() => setFlow(fetchProfile(1))}>
        Load next Profile
      </button>
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
