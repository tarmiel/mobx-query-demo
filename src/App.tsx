import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react-lite';
import './App.css';
import reactLogo from './assets/react.svg';
import { queryClient } from './lib/api';
import { MobxQuery } from './lib/mobx-react-query';

// =============== QueryStore ===============
class QueryStore {
  q = '';

  constructor() {
    makeAutoObservable(this);
  }

  setQuery(q: string) {
    this.q = q;
  }
}

const queryStore = new QueryStore();

// ================ Users Store =============
interface User {
  id: number;
  name: string;
}

class UsersStore {
  usersQuery = new MobxQuery(
    () => ({
      queryKey: ['users', queryStore.q],
      queryFn: async () => {
        const res = await fetch(`https://jsonplaceholder.typicode.com/users?name=${queryStore.q}`);
        return res.json() as Promise<User[]>;
      },
      staleTime: 1000,
    }),
    queryClient
  );

  users: User[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setUsers(users: User[]) {
    this.users = users;
  }

  get filteredUsers() {
    console.log(queryStore.q, this.usersQuery.result);
    return this.usersQuery.data?.filter((user) => user.name.includes(queryStore.q)) ?? [];
  }

  get isLoading() {
    return this.usersQuery.result.isPending;
  }
}

const usersStore = new UsersStore();

// =================== App ==================
const App = observer(() => {
  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Mobx + React Query</h1>
      <div className="card">
        <input value={queryStore.q} onChange={(e) => queryStore.setQuery(e.target.value)} />

        <div>
          {usersStore.filteredUsers.map((user) => (
            <div key={user.id}>{user.name}</div>
          ))}
        </div>
      </div>
    </>
  );
});

export default App;
