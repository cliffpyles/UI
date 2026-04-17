import { useState } from "react";
import { Text } from "../../primitives/Text";
import { Box } from "../../primitives/Box";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { FormField } from "../../components/FormField";
import { Modal } from "../../components/Modal";
import { Dropdown } from "../../components/Dropdown";
import { Card } from "../../components/Card";
import { Tabs } from "../../components/Tabs";
import { Accordion } from "../../components/Accordion";
import { Pagination } from "../../components/Pagination";
import { SearchInput } from "../../components/SearchInput";
import { Demo } from "../components/Demo";

export default function CompositeComponents() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");

  return (
    <section>
      <Text as="h2" size="xl" weight="semibold">Composite Components</Text>

      <Demo title="FormField" description="Label, required, hint, and error states.">
        <Box display="flex" direction="column" gap="3" style={{ maxWidth: "320px" }}>
          <FormField label="Email" required hint="We'll never share your email">
            <Input placeholder="you@example.com" />
          </FormField>
          <FormField label="Password" error="Password must be at least 8 characters">
            <Input type="password" placeholder="Enter password" />
          </FormField>
        </Box>
      </Demo>

      <Demo title="Modal" description="Dialog with title, description, body, and footer actions.">
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
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setModalOpen(false)}>
                Confirm
              </Button>
            </Box>
          }
        >
          <Text>Modal body content goes here.</Text>
        </Modal>
      </Demo>

      <Demo title="Dropdown" description="Menu trigger with items, separator, and destructive action.">
        <Box display="flex" gap="3">
          <Dropdown>
            <Dropdown.Trigger>
              <Button variant="secondary">Options</Button>
            </Dropdown.Trigger>
            <Dropdown.Content>
              <Dropdown.Item onSelect={() => {}}>Edit</Dropdown.Item>
              <Dropdown.Item onSelect={() => {}}>Duplicate</Dropdown.Item>
              <Dropdown.Separator />
              <Dropdown.Item onSelect={() => {}} variant="destructive">
                Delete
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown>
        </Box>
      </Demo>

      <Demo title="Card" description="Header, actions, body, and footer composition.">
        <Box display="flex" gap="4" style={{ flexWrap: "wrap" }}>
          <Card style={{ width: "280px" }}>
            <Card.Header>
              <Card.Title>Revenue</Card.Title>
              <Card.Actions>
                <Button size="sm" variant="ghost">
                  Export
                </Button>
              </Card.Actions>
            </Card.Header>
            <Card.Body>
              <Text size="2xl" weight="bold">
                $42,000
              </Text>
              <Text size="sm" color="success">
                +12% from last month
              </Text>
            </Card.Body>
            <Card.Footer>Updated 5 min ago</Card.Footer>
          </Card>
          <Card style={{ width: "280px" }}>
            <Card.Body>
              <Text>A simple card with body content only.</Text>
            </Card.Body>
          </Card>
        </Box>
      </Demo>

      <Demo title="Tabs" description="Tab list with panels and a disabled tab.">
        <Tabs defaultValue="overview" style={{ maxWidth: "480px" }}>
          <Tabs.List>
            <Tabs.Tab value="overview">Overview</Tabs.Tab>
            <Tabs.Tab value="details">Details</Tabs.Tab>
            <Tabs.Tab value="history" disabled>
              History
            </Tabs.Tab>
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
      </Demo>

      <Demo title="Accordion" description="Expandable sections with trigger and content.">
        <Box style={{ maxWidth: "480px" }}>
          <Accordion defaultValue="item-1">
            <Accordion.Item value="item-1">
              <Accordion.Trigger>What is this design system?</Accordion.Trigger>
              <Accordion.Content>
                A React component library built for data-intensive web applications like dashboards, analytics tools, and
                admin panels.
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="item-2">
              <Accordion.Trigger>How are tokens organized?</Accordion.Trigger>
              <Accordion.Content>
                Tokens follow a 3-tier system: Primitive (raw values), Semantic (meaningful mappings), and Component
                (specific overrides).
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="item-3">
              <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
              <Accordion.Content>
                Yes. All components target WCAG 2.1 AA conformance with axe-core automated tests and keyboard navigation
                support.
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </Box>
      </Demo>

      <Demo title="Pagination" description="Page controls with page size selector and totals.">
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
      </Demo>

      <Demo title="SearchInput" description="Search-specific input with sizes, loading, and disabled.">
        <Box display="flex" direction="column" gap="3" style={{ maxWidth: "320px" }}>
          <SearchInput value={searchValue} onChange={setSearchValue} placeholder="Search items..." />
          <SearchInput size="sm" placeholder="Small search" />
          <SearchInput size="lg" placeholder="Large search" />
          <SearchInput loading placeholder="Loading..." />
          <SearchInput disabled placeholder="Disabled" />
        </Box>
      </Demo>
    </section>
  );
}
