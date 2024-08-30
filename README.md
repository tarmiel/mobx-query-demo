# Mobx + React Query Demo

This project showcases how to integrate **MobX** with **React Query** to manage both client-side and server-side state in a reactive and efficient manner.

- **MobX** provides a reactive state management system, making it easy to connect application state with the UI.
- **React Query** handles server-side data fetching, caching, and synchronization.

### Benefits

- **Reactivity**: MobX's observables track the state of React Query operations, ensuring the UI stays in sync with server data.
- **Centralized State Management**: Both local and remote data are managed in a single structure.
- **Optimized Performance**: Only necessary parts of the UI update when data changes.

### How It Works

The integration is encapsulated in a `MobxQuery` class, which automatically tracks query state changes and updates MobX stores, ensuring a seamless and responsive user experience.
