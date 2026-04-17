import { ThemeProvider } from "./providers";
import { KeyboardShortcutProvider } from "./features";
import Playground from "./playground/Playground";

function App() {
  return (
    <ThemeProvider>
      <KeyboardShortcutProvider>
        <Playground />
      </KeyboardShortcutProvider>
    </ThemeProvider>
  );
}

export default App;
