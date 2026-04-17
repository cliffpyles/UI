import { Text } from "../../primitives/Text";
import { Box } from "../../primitives/Box";
import {
  Currency,
  Percentage,
  Timestamp,
  MetricCard,
  TrendIndicator,
  StatusBadge,
  HealthIndicator,
  LiveIndicator,
  InlineMessage,
  BannerAlert,
  UnreadIndicator,
  Toast,
  UserAvatar,
  UserChip,
  TeamBadge,
  EntityLink,
  MentionToken,
  FilterChip,
  RoleBadge,
  VisibilityBadge,
  DueDateIndicator,
  TaskCard,
  WorkflowStepIndicator,
  TimeSeriesChart,
  CategoryChart,
  FunnelChart,
  HeatmapGrid,
  ChartLegend,
} from "../../domain";
import { Demo } from "../components/Demo";

export default function Domain() {
  const jane = { name: "Jane Doe", status: "online" as const };
  const bob = { name: "Bob Smith" };
  const now = new Date();
  const soon = new Date(now.getTime() + 2 * 86_400_000);
  const past = new Date(now.getTime() - 86_400_000);
  const series = [
    {
      id: "revenue",
      label: "Revenue",
      color: "#3b82f6",
      data: [
        { x: "2026-01-01", y: 10 },
        { x: "2026-02-01", y: 25 },
        { x: "2026-03-01", y: 18 },
        { x: "2026-04-01", y: 32 },
      ],
    },
  ];
  const heatmap = [
    [1, 3, 5, 2],
    [4, 6, 2, 8],
    [3, 1, 7, 5],
  ];

  return (
    <section>
      <h2>Domain Components (Phase 6)</h2>

      <Demo title="Data Display" description="MetricCard, Currency, Percentage, Timestamp, TrendIndicator.">
        <Box display="flex" gap="3" style={{ flexWrap: "wrap" }}>
          <MetricCard label="Revenue" value={1234567} format="currency" currency="USD" />
          <MetricCard
            label="Active users"
            value={48200}
            format="compact"
            trend={{ direction: "up", value: 12.5 }}
            sparkline={[4, 7, 6, 9, 11, 13]}
          />
          <MetricCard label="Bounce rate" value={23.4} format="percent" />
        </Box>
        <Box display="flex" gap="3" style={{ marginTop: "var(--spacing-3)", flexWrap: "wrap", alignItems: "center" }}>
          <Currency value={1999.95} currency="USD" />
          <Percentage value={87.5} />
          <Timestamp date={past} />
          <TrendIndicator direction="down" value={-8.2} />
        </Box>
      </Demo>

      <Demo title="Status & State" description="StatusBadge, HealthIndicator, and LiveIndicator.">
        <Box display="flex" gap="3" style={{ flexWrap: "wrap", alignItems: "center" }}>
          <StatusBadge status="active" />
          <StatusBadge status="pending" />
          <StatusBadge status="failed" />
          <HealthIndicator health="healthy" />
          <HealthIndicator health="degraded" />
          <HealthIndicator health="down" />
          <LiveIndicator />
        </Box>
      </Demo>

      <Demo title="Notification & Messaging" description="InlineMessage, BannerAlert, UnreadIndicator, and Toast.">
        <Box display="flex" direction="column" gap="2" style={{ maxWidth: "480px" }}>
          <InlineMessage variant="info">Informational note.</InlineMessage>
          <InlineMessage variant="warning" title="Heads up">
            Warning message.
          </InlineMessage>
          <BannerAlert
            variant="error"
            title="Build failed"
            description="Last deploy returned a 500."
            dismissible
            onDismiss={() => {}}
          />
          <Box display="flex" gap="2" style={{ alignItems: "center" }}>
            <Text size="sm">Notifications</Text>
            <UnreadIndicator count={7} />
          </Box>
          <Toast title="Saved" description="Changes were persisted." variant="success" dismissible={false} />
        </Box>
      </Demo>

      <Demo title="Identity & Entity" description="UserAvatar, UserChip, TeamBadge, EntityLink, MentionToken.">
        <Box display="flex" gap="3" style={{ flexWrap: "wrap", alignItems: "center" }}>
          <UserAvatar user={jane} showPresence size="md" />
          <UserChip user={jane} />
          <UserChip user={bob} removable onRemove={() => {}} />
          <TeamBadge team={{ name: "Platform Team", color: "#6366f1" }} />
          <EntityLink entity={{ type: "user", id: "1", label: "Jane Doe" }} href="#" />
          <MentionToken entity={{ type: "user", label: "jane" }} />
        </Box>
      </Demo>

      <Demo title="Filtering & Query" description="FilterChip for active query constraints.">
        <Box display="flex" gap="2" style={{ flexWrap: "wrap" }}>
          <FilterChip field="status" operator="=" value="active" onRemove={() => {}} />
          <FilterChip field="created" operator=">" value="2026-01-01" onRemove={() => {}} />
        </Box>
      </Demo>

      <Demo title="Permission & Access" description="RoleBadge and VisibilityBadge variants.">
        <Box display="flex" gap="2" style={{ flexWrap: "wrap", alignItems: "center" }}>
          <RoleBadge role="admin" />
          <RoleBadge role="member" />
          <VisibilityBadge visibility="private" />
          <VisibilityBadge visibility="team" />
          <VisibilityBadge visibility="public" />
        </Box>
      </Demo>

      <Demo title="Workflow & Task" description="DueDateIndicator, WorkflowStepIndicator, and TaskCard.">
        <Box display="flex" direction="column" gap="3" style={{ maxWidth: "480px" }}>
          <Box display="flex" gap="3" style={{ alignItems: "center" }}>
            <DueDateIndicator date={soon} />
            <DueDateIndicator date={past} />
          </Box>
          <WorkflowStepIndicator
            steps={[
              { id: "a", label: "Start" },
              { id: "b", label: "Review" },
              { id: "c", label: "Ship" },
            ]}
            currentStep="b"
          />
          <TaskCard
            task={{
              id: "1",
              title: "Ship Phase 6 domain components",
              status: "active",
              priority: "high",
              assignee: jane,
              dueDate: soon,
              labels: [{ id: "a", name: "design-system", color: "#6366f1" }],
            }}
            onActivate={() => {}}
          />
        </Box>
      </Demo>

      <Demo title="Chart & Visualization" description="Time series, category, funnel, heatmap, and legend.">
        <Box display="flex" direction="column" gap="3" style={{ maxWidth: "600px" }}>
          <TimeSeriesChart series={series} height={180} />
          <ChartLegend series={[{ id: "revenue", label: "Revenue", color: "#3b82f6" }]} />
          <CategoryChart
            data={[
              { category: "Jan", value: 20 },
              { category: "Feb", value: 35 },
              { category: "Mar", value: 28 },
              { category: "Apr", value: 42 },
            ]}
            height={160}
          />
          <FunnelChart
            stages={[
              { label: "Visited", value: 1000 },
              { label: "Signed up", value: 400 },
              { label: "Purchased", value: 90 },
            ]}
          />
          <HeatmapGrid
            data={heatmap}
            xLabels={["Mon", "Tue", "Wed", "Thu"]}
            yLabels={["Morning", "Afternoon", "Evening"]}
          />
        </Box>
      </Demo>
    </section>
  );
}
