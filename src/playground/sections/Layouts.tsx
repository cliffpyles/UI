import { useState } from "react";
import { Text } from "../../primitives/Text";
import { Box } from "../../primitives/Box";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { FormField } from "../../components/FormField";
import { Card } from "../../components/Card";
import { MetricCard, FilterChip } from "../../domain";
import {
  AppShell,
  Breadcrumbs,
  MasterDetailLayout,
  EntityDetailLayout,
  DashboardFrame,
  MetricOverviewLayout,
  CardListLayout,
  KanbanLayout,
  FilterBarLayout,
  FullPageFormLayout,
  MultiStepFormLayout,
  StatusPageLayout,
  AlertFeedLayout,
  BillingUsageLayout,
  EmptyStateScaffoldLayout,
  OnboardingChecklistLayout,
  SampleDataModeLayout,
  SharedLinkLayout,
  ExportConfigurationLayout,
} from "../../layouts";
import { Demo } from "../components/Demo";

export default function Layouts() {
  const [checklistTasks, setChecklistTasks] = useState([
    { id: "1", title: "Invite teammates", completed: true },
    { id: "2", title: "Connect data source", completed: true },
    { id: "3", title: "Create first dashboard", completed: false },
    { id: "4", title: "Configure alerts", completed: false },
  ]);

  const systems = [
    { id: "api", name: "API Gateway", status: "operational" as const, uptime: "99.99%" },
    { id: "db", name: "Primary Database", status: "degraded" as const, uptime: "99.2%" },
    { id: "q", name: "Background Queue", status: "operational" as const, uptime: "99.98%" },
  ];

  const alerts = [
    {
      id: "a1",
      severity: "critical" as const,
      title: "Disk usage > 95%",
      timestamp: "2m ago",
      content: "db-primary-01",
    },
    { id: "a2", severity: "warning" as const, title: "High latency", timestamp: "12m ago", content: "us-east-1" },
    { id: "a3", severity: "info" as const, title: "Deployment complete", timestamp: "1h ago", content: "api v2.3.1" },
  ];

  return (
    <section>
      <Text as="h2" size="xl" weight="semibold">Layouts (Phase 7)</Text>

      <Demo title="AppShell" description="Header, sidebar, and main with breadcrumbs.">
        <Box
          style={{
            height: 260,
            border: "1px solid var(--color-border-default)",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
          }}
        >
          <AppShell>
            <AppShell.Header>
              <strong>Acme Analytics</strong>
            </AppShell.Header>
            <AppShell.Sidebar>
              <Text>Navigation</Text>
            </AppShell.Sidebar>
            <AppShell.Main>
              <Breadcrumbs
                items={[{ label: "Home", href: "#" }, { label: "Reports", href: "#" }, { label: "Revenue" }]}
              />
              <Text>Main content region</Text>
            </AppShell.Main>
          </AppShell>
        </Box>
      </Demo>

      <Demo title="MasterDetailLayout" description="List master pane with entity detail pane.">
        <Box
          style={{
            height: 220,
            border: "1px solid var(--color-border-default)",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
          }}
        >
          <MasterDetailLayout
            master={
              <Box padding="4">
                <Text>Item 1</Text>
                <Text>Item 2</Text>
                <Text>Item 3</Text>
              </Box>
            }
            detail={
              <EntityDetailLayout title="Item 1" subtitle="Selected detail view">
                <Text>Entity detail content.</Text>
              </EntityDetailLayout>
            }
          />
        </Box>
      </Demo>

      <Demo title="DashboardFrame + MetricOverviewLayout" description="Widget grid with metric overview row.">
        <DashboardFrame
          widgets={[
            {
              id: "metrics",
              span: 12,
              content: (
                <MetricOverviewLayout
                  metrics={[
                    <MetricCard
                      key="1"
                      label="Revenue"
                      value={124000}
                      format="currency"
                      compact
                      trend={{ direction: "up", value: 12 }}
                    />,
                    <MetricCard
                      key="2"
                      label="Users"
                      value={8240}
                      format="number"
                      trend={{ direction: "up", value: 4 }}
                    />,
                    <MetricCard
                      key="3"
                      label="Churn"
                      value={2.1}
                      format="percent"
                      trend={{ direction: "down", value: -0.3 }}
                    />,
                    <MetricCard key="4" label="NPS" value={62} format="number" trend={{ direction: "flat", value: 0 }} />,
                  ]}
                />
              ),
            },
          ]}
        />
      </Demo>

      <Demo title="FilterBarLayout" description="Active filter chips with clear-all control.">
        <FilterBarLayout
          filters={[
            <FilterChip key="1" field="Region" value="US-East" onRemove={() => {}} />,
            <FilterChip key="2" field="Plan" value="Enterprise" onRemove={() => {}} />,
            <FilterChip key="3" field="Status" value="Active" onRemove={() => {}} />,
          ]}
          onClearAll={() => {}}
        />
      </Demo>

      <Demo title="CardListLayout" description="Grid of cards rendered from a data array.">
        <CardListLayout
          items={[
            { id: "1", title: "Alpha Project", owner: "Alex" },
            { id: "2", title: "Beta Experiment", owner: "Morgan" },
            { id: "3", title: "Gamma Initiative", owner: "Jordan" },
          ]}
          renderCard={(item) => (
            <Card>
              <Text weight="semibold">{item.title}</Text>
              <Text color="secondary">Owner: {item.owner}</Text>
            </Card>
          )}
        />
      </Demo>

      <Demo title="KanbanLayout" description="Columns with WIP limits and draggable-style cards.">
        <Box style={{ height: 220 }}>
          <KanbanLayout
            columns={[
              {
                id: "todo",
                title: "To Do",
                cards: [
                  <Card key="1">
                    <Text>Design spec</Text>
                  </Card>,
                ],
                wipLimit: 3,
              },
              {
                id: "doing",
                title: "In Progress",
                cards: [
                  <Card key="2">
                    <Text>Build API</Text>
                  </Card>,
                ],
                wipLimit: 2,
              },
              {
                id: "done",
                title: "Done",
                cards: [
                  <Card key="3">
                    <Text>Research</Text>
                  </Card>,
                ],
              },
            ]}
          />
        </Box>
      </Demo>

      <Demo title="FullPageFormLayout" description="Full-page form body with sticky footer actions.">
        <Box
          style={{
            height: 220,
            border: "1px solid var(--color-border-default)",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
          }}
        >
          <FullPageFormLayout
            footer={
              <>
                <Button variant="ghost">Cancel</Button>
                <Button variant="primary">Save</Button>
              </>
            }
          >
            <FormField label="Name">
              <Input defaultValue="Untitled" />
            </FormField>
            <FormField label="Description">
              <Input defaultValue="" />
            </FormField>
          </FullPageFormLayout>
        </Box>
      </Demo>

      <Demo title="MultiStepFormLayout" description="Stepper with per-step content panels.">
        <MultiStepFormLayout
          currentStep={1}
          steps={[
            { id: "1", label: "Account", content: <Text>Step 1 content</Text> },
            { id: "2", label: "Details", content: <Text>Step 2 content</Text> },
            { id: "3", label: "Review", content: <Text>Step 3 content</Text> },
          ]}
        />
      </Demo>

      <Demo title="StatusPageLayout" description="System list with status and uptime per row.">
        <StatusPageLayout systems={systems} />
      </Demo>

      <Demo title="AlertFeedLayout" description="Time-ordered alert feed with acknowledge action.">
        <AlertFeedLayout alerts={alerts} onAcknowledge={() => {}} />
      </Demo>

      <Demo title="BillingUsageLayout" description="Plan summary with per-resource usage meters.">
        <BillingUsageLayout
          plan={<Text>Plan: Enterprise — $499/mo</Text>}
          usage={[
            { id: "seats", label: "Seats", current: 24, limit: 50 },
            { id: "api", label: "API calls", current: 820000, limit: 1000000, unit: "" },
            { id: "storage", label: "Storage", current: 85, limit: 100, unit: "GB" },
          ]}
        />
      </Demo>

      <Demo title="OnboardingChecklistLayout" description="Dismissible checklist of onboarding tasks.">
        <OnboardingChecklistLayout
          title="Getting started"
          tasks={checklistTasks}
          onDismiss={() => setChecklistTasks((prev) => prev.map((t) => ({ ...t, completed: true })))}
          dismissible
        />
      </Demo>

      <Demo title="EmptyStateScaffoldLayout" description="Full-bleed empty state with primary and secondary actions.">
        <Box
          style={{
            border: "1px solid var(--color-border-default)",
            borderRadius: "var(--radius-md)",
            padding: "var(--spacing-page-padding)",
          }}
        >
          <EmptyStateScaffoldLayout
            title="No reports yet"
            description="Create your first report to get started with analytics."
            primaryAction={<Button variant="primary">Create report</Button>}
            secondaryAction={<Button variant="ghost">Learn more</Button>}
          />
        </Box>
      </Demo>

      <Demo title="SampleDataModeLayout" description="Banner wrapping content shown in sample-data mode.">
        <SampleDataModeLayout onSwitchToReal={() => {}}>
          <Box padding="4">
            <Text>Your app content renders here.</Text>
          </Box>
        </SampleDataModeLayout>
      </Demo>

      <Demo title="SharedLinkLayout" description="Shareable URL display with copy-to-clipboard action.">
        <SharedLinkLayout url="https://app.example.com/reports/abc123?view=summary" onCopy={() => {}} />
      </Demo>

      <Demo title="ExportConfigurationLayout" description="Format and scope controls with footer actions.">
        <ExportConfigurationLayout
          format={<Text>Format: CSV</Text>}
          scope={<Text>Scope: Filtered rows (1,240)</Text>}
          footer={
            <>
              <Button variant="ghost">Cancel</Button>
              <Button variant="primary">Export</Button>
            </>
          }
        />
      </Demo>
    </section>
  );
}
