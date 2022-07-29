import { Link, Route, Routes } from "react-router-dom";
import "./App.css";
import type { ReactNode } from "react";

const pages: Record<string, ReactNode> = import.meta.glob("./pages/*.tsx", {
  eager: true,
});

const routes: Array<{ name: string; element: ReactNode }> = [];
for (let pageK in pages) {
  let pageName = pageK.match(/\.\/(\w*)\/(\w*).*/)![2];

  routes.push({
    name: pageName,
    element: ((pages[pageK] as any).default)(),
  });
}

export function App() {
  return (
    <div className="App">
      <h1>Pages</h1>
      <nav>
        {routes.map(({ name }) => <Link key={name} to={`/${name}`}>{name}
        </Link>)}
      </nav>
      <hr style={{ width: "100vh" }} />
      <main>
        <Routes>
          {routes.map(({ name, element }) => (
            <Route key={name} path={`/${name}`} element={element} />
          ))}
        </Routes>
      </main>
    </div>
  );
}

export default App;
