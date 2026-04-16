import { useState } from "react";
import { ThemeProvider, useTheme } from "./providers";
import { DensityProvider, useDensity } from "./providers";
import { Text } from "./primitives/Text";
import { Box } from "./primitives/Box";
import { Icon } from "./primitives/Icon";
import { Divider } from "./primitives/Divider";
import { Badge } from "./primitives/Badge";
import { Dot } from "./primitives/Dot";
import { Spinner } from "./primitives/Spinner";
import { VisuallyHidden } from "./primitives/VisuallyHidden";
import { Input } from "./components/Input";
import { Button } from "./components/Button";
import { Checkbox } from "./components/Checkbox";
import { Radio, RadioGroup } from "./components/Radio";
import { Toggle } from "./components/Toggle";
import { Select } from "./components/Select";
import { Tag } from "./components/Tag";
import { Avatar } from "./components/Avatar";
import { Tooltip } from "./components/Tooltip";
import { Skeleton } from "./components/Skeleton";
import { FormField } from "./components/FormField";
import { Modal } from "./components/Modal";
import { Dropdown } from "./components/Dropdown";
import { Card } from "./components/Card";
import { Tabs } from "./components/Tabs";
import { Accordion } from "./components/Accordion";
import { Pagination } from "./components/Pagination";
import { SearchInput } from "./components/SearchInput";
import { EmptyState } from "./components/EmptyState";
import { ErrorState } from "./components/ErrorState";
import { ProgressBar } from "./components/ProgressBar";
import { Table } from "./components/Table";
import {
  formatNumber,
  formatCompact,
  formatCurrency,
  formatPercent,
  formatDate,
  formatDuration,
  formatBytes,
} from "./utils/format";
import "./App.css";

function Playground() {
  const [activeDensity, setActiveDensity] = useState<
    "compact" | "default" | "comfortable"
  >("default");

  return (
    <DensityProvider density={activeDensity}>
      <PlaygroundContent onDensityChange={setActiveDensity} />
    </DensityProvider>
  );
}

function PlaygroundContent({
  onDensityChange,
}: {
  onDensityChange: (d: "compact" | "default" | "comfortable") => void;
}) {
  const { theme, setTheme } = useTheme();
  const { density } = useDensity();

  return (
    <div className="playground">
      <h1>UI Component Library</h1>

      <div className="controls">
        <label>
          Theme:{" "}
          <select
            value={theme}
            onChange={(e) =>
              setTheme(e.target.value as "light" | "dark" | "system")
            }
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        <label>
          Density:{" "}
          <select
            value={density}
            onChange={(e) =>
              onDensityChange(
                e.target.value as "compact" | "default" | "comfortable",
              )
            }
          >
            <option value="compact">Compact</option>
            <option value="default">Default</option>
            <option value="comfortable">Comfortable</option>
          </select>
        </label>
      </div>

      <section>
        <h2>Semantic Colors</h2>
        <h3>Status</h3>
        <div className="status-row">
          <span className="status-badge status-badge--success">Success</span>
          <span className="status-badge status-badge--warning">Warning</span>
          <span className="status-badge status-badge--error">Error</span>
          <span className="status-badge status-badge--info">Info</span>
        </div>
      </section>

      <section>
        <h2>Surfaces</h2>
        <div
          style={{
            display: "flex",
            gap: "var(--spacing-content-gap)",
            flexWrap: "wrap",
          }}
        >
          <div className="token-demo">
            <strong>Raised</strong>
            <p style={{ color: "var(--color-text-secondary)" }}>
              Cards and panels
            </p>
          </div>
          <div
            className="token-demo"
            style={{ background: "var(--color-background-surface-sunken)" }}
          >
            <strong>Sunken</strong>
            <p style={{ color: "var(--color-text-secondary)" }}>
              Inset areas and wells
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>Typography</h2>
        <p style={{ fontSize: "var(--font-size-2xs)" }}>2xs (10px)</p>
        <p style={{ fontSize: "var(--font-size-xs)" }}>xs (12px)</p>
        <p style={{ fontSize: "var(--font-size-sm)" }}>sm (14px)</p>
        <p style={{ fontSize: "var(--font-size-base)" }}>base (16px)</p>
        <p style={{ fontSize: "var(--font-size-lg)" }}>lg (18px)</p>
        <p style={{ fontSize: "var(--font-size-xl)" }}>xl (20px)</p>
        <p style={{ fontSize: "var(--font-size-2xl)" }}>2xl (24px)</p>
      </section>

      <section>
        <h2>Categorical Colors</h2>
        <div style={{ display: "flex", gap: "var(--spacing-2)" }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              style={{
                width: "2.5rem",
                height: "2.5rem",
                borderRadius: "var(--radius-md)",
                background: `var(--color-categorical-${i})`,
              }}
            />
          ))}
        </div>
      </section>

      <Divider spacing="6" />

      <section>
        <h2>Primitives</h2>

        <h3>Text</h3>
        <Box display="flex" direction="column" gap="2">
          <Text size="4xl" weight="bold">4xl Bold</Text>
          <Text size="2xl" weight="semibold">2xl Semibold</Text>
          <Text size="lg" weight="medium">lg Medium</Text>
          <Text size="base">base Normal</Text>
          <Text size="sm" color="secondary">sm Secondary</Text>
          <Text size="xs" color="tertiary">xs Tertiary</Text>
          <Text size="sm" family="mono" tabularNums>mono tabularNums: 1,234.56</Text>
          <Text truncate style={{ maxWidth: "200px" }}>
            This is a very long text that should be truncated with an ellipsis
          </Text>
          <Text size="sm" color="success">Success text</Text>
          <Text size="sm" color="warning">Warning text</Text>
          <Text size="sm" color="error">Error text</Text>
        </Box>

        <Divider spacing="4" />

        <h3>Box</h3>
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

        <Divider spacing="4" />

        <h3>Icon</h3>
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

        <Divider spacing="4" />

        <h3>Badge</h3>
        <Box display="flex" gap="2" align="center">
          <Badge variant="neutral">Neutral</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
        </Box>
        <Box display="flex" gap="2" align="center" style={{ marginTop: "var(--spacing-2)" }}>
          <Badge variant="neutral" size="sm">sm</Badge>
          <Badge variant="success" size="sm">sm</Badge>
        </Box>

        <Divider spacing="4" />

        <h3>Dot</h3>
        <Box display="flex" gap="4" align="center">
          <Box display="flex" gap="1" align="center">
            <Dot color="success" /><Text size="sm">Online</Text>
          </Box>
          <Box display="flex" gap="1" align="center">
            <Dot color="warning" /><Text size="sm">Away</Text>
          </Box>
          <Box display="flex" gap="1" align="center">
            <Dot color="error" /><Text size="sm">Offline</Text>
          </Box>
          <Box display="flex" gap="1" align="center">
            <Dot color="info" size="md" /><Text size="sm">Info (md)</Text>
          </Box>
          <Box display="flex" gap="1" align="center">
            <Dot color="neutral" /><Text size="sm">Neutral</Text>
          </Box>
        </Box>

        <Divider spacing="4" />

        <h3>Spinner</h3>
        <Box display="flex" gap="4" align="center">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </Box>

        <Divider spacing="4" />

        <h3>VisuallyHidden</h3>
        <Box padding="2" background="raised" radius="md">
          <Text size="sm" color="secondary">
            There is a visually hidden element here:{" "}
            <VisuallyHidden>This text is only for screen readers</VisuallyHidden>
            (inspect the DOM to see it)
          </Text>
        </Box>
      </section>

      <Divider spacing="6" />

      <BaseComponentsSection />

      <Divider spacing="6" />

      <CompositeComponentsSection />

      <Divider spacing="6" />

      <DataDisplaySection />
    </div>
  );
}

function BaseComponentsSection() {
  const [inputValue, setInputValue] = useState("");
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [radioValue, setRadioValue] = useState("apple");
  const [toggleChecked, setToggleChecked] = useState(false);
  const [selectValue, setSelectValue] = useState("banana");

  const selectOptions = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "cherry", label: "Cherry" },
    { value: "durian", label: "Durian", disabled: true },
  ];

  return (
    <section>
      <h2>Base Components</h2>

      <h3>Button</h3>
      <Box display="flex" gap="3" align="center">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
      </Box>
      <Box display="flex" gap="3" align="center" style={{ marginTop: "var(--spacing-2)" }}>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button loading>Loading</Button>
        <Button disabled>Disabled</Button>
      </Box>
      <Box display="flex" gap="3" align="center" style={{ marginTop: "var(--spacing-2)" }}>
        <Button as="a" href="#">Link Button</Button>
      </Box>

      <Divider spacing="4" />

      <h3>Input</h3>
      <Box display="flex" direction="column" gap="3" style={{ maxWidth: "320px" }}>
        <Input placeholder="Default input" aria-label="Default" />
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Controlled"
          aria-label="Controlled"
        />
        <Input size="sm" placeholder="Small" aria-label="Small" />
        <Input size="lg" placeholder="Large" aria-label="Large" />
        <Input error placeholder="Error state" aria-label="Error" />
        <Input disabled placeholder="Disabled" aria-label="Disabled" />
        <Input
          leadingIcon={<Icon name="search" size="sm" />}
          placeholder="With icon"
          aria-label="Search"
        />
        <Input
          leadingAddon="https://"
          trailingAddon=".com"
          placeholder="domain"
          aria-label="Domain"
        />
      </Box>

      <Divider spacing="4" />

      <h3>Checkbox</h3>
      <Box display="flex" direction="column" gap="2">
        <Checkbox
          checked={checkboxChecked}
          onChange={setCheckboxChecked}
          label="Controlled checkbox"
        />
        <Checkbox defaultChecked label="Default checked" />
        <Checkbox indeterminate label="Indeterminate" />
        <Checkbox disabled label="Disabled" />
        <Checkbox
          label="With description"
          description="Additional information about this option"
        />
      </Box>

      <Divider spacing="4" />

      <h3>Radio</h3>
      <RadioGroup value={radioValue} onChange={setRadioValue} aria-label="Fruits">
        <Radio value="apple" label="Apple" />
        <Radio value="banana" label="Banana" />
        <Radio value="cherry" label="Cherry" description="A sweet red fruit" />
        <Radio value="durian" label="Durian" disabled />
      </RadioGroup>

      <Divider spacing="4" />

      <h3>Toggle</h3>
      <Box display="flex" direction="column" gap="2">
        <Toggle
          checked={toggleChecked}
          onChange={setToggleChecked}
          label="Feature toggle"
        />
        <Toggle defaultChecked label="Default on" />
        <Toggle size="sm" label="Small toggle" />
        <Toggle disabled label="Disabled" />
      </Box>

      <Divider spacing="4" />

      <h3>Select</h3>
      <Box display="flex" direction="column" gap="3" style={{ maxWidth: "320px" }}>
        <Select
          options={selectOptions}
          value={selectValue}
          onChange={setSelectValue}
          aria-label="Fruit"
        />
        <Select
          options={selectOptions}
          placeholder="Choose a fruit..."
          aria-label="Fruit placeholder"
        />
        <Select options={selectOptions} size="sm" aria-label="Small select" />
        <Select options={selectOptions} size="lg" aria-label="Large select" />
        <Select options={selectOptions} error aria-label="Error select" />
        <Select options={selectOptions} disabled aria-label="Disabled select" />
      </Box>

      <Divider spacing="4" />

      <h3>Tag</h3>
      <Box display="flex" gap="2" align="center">
        <Tag variant="neutral">Neutral</Tag>
        <Tag variant="primary">Primary</Tag>
        <Tag variant="success">Success</Tag>
        <Tag variant="warning">Warning</Tag>
        <Tag variant="error">Error</Tag>
      </Box>
      <Box display="flex" gap="2" align="center" style={{ marginTop: "var(--spacing-2)" }}>
        <Tag size="sm">Small</Tag>
        <Tag removable onRemove={() => {}}>Removable</Tag>
      </Box>

      <Divider spacing="4" />

      <h3>Avatar</h3>
      <Box display="flex" gap="3" align="center">
        <Avatar src="https://i.pravatar.cc/150?u=a" alt="User A" size="sm" />
        <Avatar src="https://i.pravatar.cc/150?u=b" alt="User B" size="md" />
        <Avatar src="https://i.pravatar.cc/150?u=c" alt="User C" size="lg" />
        <Avatar src="https://i.pravatar.cc/150?u=d" alt="User D" size="xl" />
      </Box>
      <Box display="flex" gap="3" align="center" style={{ marginTop: "var(--spacing-2)" }}>
        <Avatar alt="Jane Doe" name="Jane Doe" />
        <Avatar alt="John Smith" name="John Smith" />
        <Avatar alt="Unknown" />
        <Avatar alt="Square" name="Square User" shape="square" />
      </Box>

      <Divider spacing="4" />

      <h3>Tooltip</h3>
      <Box display="flex" gap="4" align="center">
        <Tooltip content="I'm on top" side="top">
          <Button variant="secondary" size="sm">Top</Button>
        </Tooltip>
        <Tooltip content="I'm on the bottom" side="bottom">
          <Button variant="secondary" size="sm">Bottom</Button>
        </Tooltip>
        <Tooltip content="I'm on the left" side="left">
          <Button variant="secondary" size="sm">Left</Button>
        </Tooltip>
        <Tooltip content="I'm on the right" side="right">
          <Button variant="secondary" size="sm">Right</Button>
        </Tooltip>
      </Box>

      <Divider spacing="4" />

      <h3>Skeleton</h3>
      <Box display="flex" direction="column" gap="3" style={{ maxWidth: "320px" }}>
        <Skeleton />
        <Skeleton lines={3} />
        <Box display="flex" gap="3" align="center">
          <Skeleton variant="circle" width={40} />
          <Box display="flex" direction="column" gap="1" style={{ flex: 1 }}>
            <Skeleton width="60%" />
            <Skeleton width="40%" />
          </Box>
        </Box>
        <Skeleton variant="rect" width="100%" height={120} />
      </Box>
    </section>
  );
}

function CompositeComponentsSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");

  return (
    <section>
      <h2>Composite Components</h2>

      <h3>FormField</h3>
      <Box display="flex" direction="column" gap="3" style={{ maxWidth: "320px" }}>
        <FormField label="Email" required hint="We'll never share your email">
          <Input placeholder="you@example.com" />
        </FormField>
        <FormField label="Password" error="Password must be at least 8 characters">
          <Input type="password" placeholder="Enter password" />
        </FormField>
      </Box>

      <Divider spacing="4" />

      <h3>Modal</h3>
      <Box display="flex" gap="3">
        <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
      </Box>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirm Action"
        description="This action cannot be undone. Are you sure you want to proceed?"
        footer={
          <Box display="flex" gap="2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}>Confirm</Button>
          </Box>
        }
      >
        <Text>Modal body content goes here.</Text>
      </Modal>

      <Divider spacing="4" />

      <h3>Dropdown</h3>
      <Box display="flex" gap="3">
        <Dropdown>
          <Dropdown.Trigger>
            <Button variant="secondary">Options</Button>
          </Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Item onSelect={() => {}}>Edit</Dropdown.Item>
            <Dropdown.Item onSelect={() => {}}>Duplicate</Dropdown.Item>
            <Dropdown.Separator />
            <Dropdown.Item onSelect={() => {}} variant="destructive">Delete</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>
      </Box>

      <Divider spacing="4" />

      <h3>Card</h3>
      <Box display="flex" gap="4" style={{ flexWrap: "wrap" }}>
        <Card style={{ width: "280px" }}>
          <Card.Header>
            <Card.Title>Revenue</Card.Title>
            <Card.Actions><Button size="sm" variant="ghost">Export</Button></Card.Actions>
          </Card.Header>
          <Card.Body>
            <Text size="2xl" weight="bold">$42,000</Text>
            <Text size="sm" color="success">+12% from last month</Text>
          </Card.Body>
          <Card.Footer>Updated 5 min ago</Card.Footer>
        </Card>
        <Card style={{ width: "280px" }}>
          <Card.Body>
            <Text>A simple card with body content only.</Text>
          </Card.Body>
        </Card>
      </Box>

      <Divider spacing="4" />

      <h3>Tabs</h3>
      <Tabs defaultValue="overview" style={{ maxWidth: "480px" }}>
        <Tabs.List>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="details">Details</Tabs.Tab>
          <Tabs.Tab value="history" disabled>History</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="overview">
          <Text>Overview content panel. This tab is selected by default.</Text>
        </Tabs.Panel>
        <Tabs.Panel value="details">
          <Text>Details content panel with more information.</Text>
        </Tabs.Panel>
        <Tabs.Panel value="history">
          <Text>History content panel.</Text>
        </Tabs.Panel>
      </Tabs>

      <Divider spacing="4" />

      <h3>Accordion</h3>
      <Box style={{ maxWidth: "480px" }}>
        <Accordion defaultValue="item-1">
          <Accordion.Item value="item-1">
            <Accordion.Trigger>What is this design system?</Accordion.Trigger>
            <Accordion.Content>
              A React component library built for data-intensive web applications
              like dashboards, analytics tools, and admin panels.
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-2">
            <Accordion.Trigger>How are tokens organized?</Accordion.Trigger>
            <Accordion.Content>
              Tokens follow a 3-tier system: Primitive (raw values), Semantic
              (meaningful mappings), and Component (specific overrides).
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-3">
            <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
            <Accordion.Content>
              Yes. All components target WCAG 2.1 AA conformance with axe-core
              automated tests and keyboard navigation support.
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </Box>

      <Divider spacing="4" />

      <h3>Pagination</h3>
      <Box display="flex" direction="column" gap="4" style={{ maxWidth: "600px" }}>
        <Pagination
          page={currentPage}
          totalPages={10}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          totalItems={95}
        />
      </Box>

      <Divider spacing="4" />

      <h3>SearchInput</h3>
      <Box display="flex" direction="column" gap="3" style={{ maxWidth: "320px" }}>
        <SearchInput
          value={searchValue}
          onChange={setSearchValue}
          placeholder="Search items..."
        />
        <SearchInput size="sm" placeholder="Small search" />
        <SearchInput size="lg" placeholder="Large search" />
        <SearchInput loading placeholder="Loading..." />
        <SearchInput disabled placeholder="Disabled" />
      </Box>
    </section>
  );
}

function DataDisplaySection() {
  const now = new Date();
  const fiveMinAgo = new Date(now.getTime() - 5 * 60_000);
  const threeHoursAgo = new Date(now.getTime() - 3 * 3_600_000);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15);

  return (
    <section>
      <h2>Data Display (Phase 5)</h2>

      <h3>Formatting Utilities</h3>
      <Box display="flex" direction="column" gap="2">
        <Text size="sm"><strong>formatNumber:</strong> {formatNumber(1234567.89, { locale: "en-US", decimals: 2 })}</Text>
        <Text size="sm"><strong>formatCompact:</strong> {formatCompact(3400000, { locale: "en-US" })}</Text>
        <Text size="sm"><strong>formatCurrency:</strong> {formatCurrency(1234.56, "USD", { locale: "en-US" })}</Text>
        <Text size="sm"><strong>formatPercent:</strong> {formatPercent(12.3, { locale: "en-US", sign: true })}</Text>
        <Text size="sm"><strong>formatDate (relative):</strong> {formatDate(fiveMinAgo, { locale: "en-US", now })}</Text>
        <Text size="sm"><strong>formatDate (hours):</strong> {formatDate(threeHoursAgo, { locale: "en-US", now })}</Text>
        <Text size="sm"><strong>formatDate (absolute):</strong> {formatDate(lastMonth, { locale: "en-US", now })}</Text>
        <Text size="sm"><strong>formatDuration:</strong> {formatDuration(8_100_000)}</Text>
        <Text size="sm"><strong>formatBytes:</strong> {formatBytes(5_242_880, { locale: "en-US" })}</Text>
        <Text size="sm"><strong>Null handling:</strong> {formatNumber(null)} / {formatCurrency(undefined, "USD")} / {formatPercent(NaN)}</Text>
      </Box>

      <Divider spacing="4" />

      <h3>EmptyState</h3>
      <Box display="flex" gap="4" style={{ flexWrap: "wrap" }}>
        <Box style={{ width: "280px" }}>
          <EmptyState
            variant="no-data"
            title="No items yet"
            description="Create your first item to get started."
            action={<Button size="sm">Create Item</Button>}
          />
        </Box>
        <Box style={{ width: "280px" }}>
          <EmptyState
            variant="no-results"
            title="No results found"
            description="Try adjusting your search or filters."
          />
        </Box>
        <Box style={{ width: "280px" }}>
          <EmptyState
            variant="restricted"
            title="Access restricted"
            description="You don't have permission to view this."
          />
        </Box>
      </Box>

      <Divider spacing="4" />

      <h3>ErrorState</h3>
      <Box display="flex" gap="4" style={{ flexWrap: "wrap" }}>
        <Box style={{ width: "320px" }}>
          <ErrorState
            title="Failed to load data"
            description="An unexpected error occurred while loading."
            onRetry={() => {}}
            details="Error: 500 Internal Server Error\nRequest ID: abc-123"
          />
        </Box>
        <Box style={{ width: "320px" }}>
          <ErrorState
            description="Check your network connection."
            onRetry={() => {}}
            retrying
          />
        </Box>
      </Box>

      <Divider spacing="4" />

      <h3>ProgressBar</h3>
      <Box display="flex" direction="column" gap="4" style={{ maxWidth: "400px" }}>
        <ProgressBar value={65} label="Upload progress" showValue />
        <ProgressBar value={100} variant="success" label="Complete" showValue />
        <ProgressBar value={80} variant="warning" label="Storage" showValue size="sm" />
        <ProgressBar value={30} variant="error" label="Errors" showValue />
        <ProgressBar label="Loading data..." />
      </Box>

      <Divider spacing="4" />

      <h3>Table</h3>
      <Box style={{ maxWidth: "640px" }}>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head sortable sorted="asc" onSort={() => {}}>Name</Table.Head>
              <Table.Head>Status</Table.Head>
              <Table.Head sortable numeric onSort={() => {}}>Revenue</Table.Head>
              <Table.Head numeric>Growth</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Acme Corp</Table.Cell>
              <Table.Cell><Badge variant="success">Active</Badge></Table.Cell>
              <Table.Cell numeric>{formatCurrency(1234567, "USD", { locale: "en-US", decimals: 0 })}</Table.Cell>
              <Table.Cell numeric>{formatPercent(12.3, { locale: "en-US", sign: true })}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Globex Inc</Table.Cell>
              <Table.Cell><Badge variant="warning">Pending</Badge></Table.Cell>
              <Table.Cell numeric>{formatCurrency(456789, "USD", { locale: "en-US", decimals: 0 })}</Table.Cell>
              <Table.Cell numeric>{formatPercent(-3.2, { locale: "en-US", sign: true })}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Initech</Table.Cell>
              <Table.Cell><Badge variant="error">Inactive</Badge></Table.Cell>
              <Table.Cell numeric>{formatCurrency(89012, "USD", { locale: "en-US", decimals: 0 })}</Table.Cell>
              <Table.Cell numeric>{formatPercent(0, { locale: "en-US", sign: true })}</Table.Cell>
            </Table.Row>
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.Cell colSpan={4}>3 companies</Table.Cell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </Box>
    </section>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Playground />
    </ThemeProvider>
  );
}

export default App;
