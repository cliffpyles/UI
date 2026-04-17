import { Text } from "../../primitives/Text";
import { Box } from "../../primitives/Box";
import { Icon } from "../../primitives/Icon";
import { Badge } from "../../primitives/Badge";
import { Dot } from "../../primitives/Dot";
import { Spinner } from "../../primitives/Spinner";
import { VisuallyHidden } from "../../primitives/VisuallyHidden";
import { Demo } from "../components/Demo";

export default function Primitives() {
  return (
    <section>
      <Text as="h2" size="xl" weight="semibold">Primitives</Text>

      <Demo title="Text" description="Typography primitive with size, weight, color, truncation.">
        <Box display="flex" direction="column" gap="2">
          <Text size="4xl" weight="bold">
            4xl Bold
          </Text>
          <Text size="2xl" weight="semibold">
            2xl Semibold
          </Text>
          <Text size="lg" weight="medium">
            lg Medium
          </Text>
          <Text size="base">base Normal</Text>
          <Text size="sm" color="secondary">
            sm Secondary
          </Text>
          <Text size="xs" color="tertiary">
            xs Tertiary
          </Text>
          <Text size="sm" family="mono" tabularNums>
            mono tabularNums: 1,234.56
          </Text>
          <Text truncate style={{ maxWidth: "200px" }}>
            This is a very long text that should be truncated with an ellipsis
          </Text>
          <Text size="sm" color="success">
            Success text
          </Text>
          <Text size="sm" color="warning">
            Warning text
          </Text>
          <Text size="sm" color="error">
            Error text
          </Text>
        </Box>
      </Demo>

      <Demo title="Box" description="Layout primitive with padding, background, radius, shadow props.">
        <Box display="flex" gap="3">
          <Box padding="4" background="surface" radius="md" shadow="sm">
            Surface + shadow-sm
          </Box>
          <Box padding="4" background="raised" radius="md" shadow="md">
            Raised + shadow-md
          </Box>
          <Box padding="4" background="sunken" radius="lg">
            Sunken + radius-lg
          </Box>
        </Box>
      </Demo>

      <Demo title="Icon" description="SVG icon primitive with size and color variants.">
        <Box display="flex" gap="3" align="center">
          <Icon name="search" size="xs" />
          <Icon name="check" size="sm" />
          <Icon name="edit" size="md" />
          <Icon name="settings" size="lg" />
          <Icon name="user" size="xl" />
        </Box>
        <Box display="flex" gap="2" align="center" style={{ marginTop: "var(--spacing-2)" }}>
          <Icon name="check" color="success" label="Success" />
          <Icon name="alert-triangle" color="warning" label="Warning" />
          <Icon name="alert-circle" color="error" label="Error" />
          <Icon name="info" color="info" label="Info" />
        </Box>
      </Demo>

      <Demo title="Badge" description="Compact label for status or metadata.">
        <Box display="flex" gap="2" align="center">
          <Badge variant="neutral">Neutral</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
        </Box>
        <Box display="flex" gap="2" align="center" style={{ marginTop: "var(--spacing-2)" }}>
          <Badge variant="neutral" size="sm">
            sm
          </Badge>
          <Badge variant="success" size="sm">
            sm
          </Badge>
        </Box>
      </Demo>

      <Demo title="Dot" description="Status dot for presence / state indication.">
        <Box display="flex" gap="4" align="center">
          <Box display="flex" gap="1" align="center">
            <Dot color="success" />
            <Text size="sm">Online</Text>
          </Box>
          <Box display="flex" gap="1" align="center">
            <Dot color="warning" />
            <Text size="sm">Away</Text>
          </Box>
          <Box display="flex" gap="1" align="center">
            <Dot color="error" />
            <Text size="sm">Offline</Text>
          </Box>
          <Box display="flex" gap="1" align="center">
            <Dot color="info" size="md" />
            <Text size="sm">Info (md)</Text>
          </Box>
          <Box display="flex" gap="1" align="center">
            <Dot color="neutral" />
            <Text size="sm">Neutral</Text>
          </Box>
        </Box>
      </Demo>

      <Demo title="Spinner" description="Loading spinner with size variants.">
        <Box display="flex" gap="4" align="center">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </Box>
      </Demo>

      <Demo title="VisuallyHidden" description="Screen-reader-only text.">
        <Box padding="2" background="raised" radius="md">
          <Text size="sm" color="secondary">
            There is a visually hidden element here:{" "}
            <VisuallyHidden>This text is only for screen readers</VisuallyHidden>
            (inspect the DOM to see it)
          </Text>
        </Box>
      </Demo>
    </section>
  );
}
