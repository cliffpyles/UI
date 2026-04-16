import { Button } from "./components";
import "./App.css";

function App() {
  return (
    <div className="playground">
      <h1>UI Component Library</h1>

      <section>
        <h2>Button</h2>
        <div className="component-row">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
        <div className="component-row">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
        <div className="component-row">
          <Button disabled>Disabled</Button>
        </div>
      </section>
    </div>
  );
}

export default App;
