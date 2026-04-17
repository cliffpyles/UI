import { Component, type ReactNode } from "react";
import { Text } from "../../primitives/Text";

interface Props {
  sectionLabel: string;
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class SectionErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.sectionLabel !== this.props.sectionLabel && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="pg-error">
          <Text as="h2" size="xl" weight="semibold">Failed to render “{this.props.sectionLabel}”</Text>
          <pre>{this.state.error.message}</pre>
          <button type="button" onClick={() => this.setState({ error: null })}>
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
