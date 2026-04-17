import { Text } from "../../primitives/Text";
import { Box } from "../../primitives/Box";
import { Divider } from "../../primitives/Divider";
import { Badge } from "../../primitives/Badge";
import { Button } from "../../components/Button";
import { EmptyState } from "../../components/EmptyState";
import { ErrorState } from "../../components/ErrorState";
import { ProgressBar } from "../../components/ProgressBar";
import { Table } from "../../components/Table";
import {
  formatNumber,
  formatCompact,
  formatCurrency,
  formatPercent,
  formatDate,
  formatDuration,
  formatBytes,
} from "../../utils/format";

export default function DataDisplay() {
  const now = new Date();
  const fiveMinAgo = new Date(now.getTime() - 5 * 60_000);
  const threeHoursAgo = new Date(now.getTime() - 3 * 3_600_000);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15);

  return (
    <section>
      <h2>Data Display (Phase 5)</h2>

      <h3>Formatting Utilities</h3>
      <Box display="flex" direction="column" gap="2">
        <Text size="sm">
          <strong>formatNumber:</strong> {formatNumber(1234567.89, { locale: "en-US", decimals: 2 })}
        </Text>
        <Text size="sm">
          <strong>formatCompact:</strong> {formatCompact(3400000, { locale: "en-US" })}
        </Text>
        <Text size="sm">
          <strong>formatCurrency:</strong> {formatCurrency(1234.56, "USD", { locale: "en-US" })}
        </Text>
        <Text size="sm">
          <strong>formatPercent:</strong> {formatPercent(12.3, { locale: "en-US", sign: true })}
        </Text>
        <Text size="sm">
          <strong>formatDate (relative):</strong> {formatDate(fiveMinAgo, { locale: "en-US", now })}
        </Text>
        <Text size="sm">
          <strong>formatDate (hours):</strong> {formatDate(threeHoursAgo, { locale: "en-US", now })}
        </Text>
        <Text size="sm">
          <strong>formatDate (absolute):</strong> {formatDate(lastMonth, { locale: "en-US", now })}
        </Text>
        <Text size="sm">
          <strong>formatDuration:</strong> {formatDuration(8_100_000)}
        </Text>
        <Text size="sm">
          <strong>formatBytes:</strong> {formatBytes(5_242_880, { locale: "en-US" })}
        </Text>
        <Text size="sm">
          <strong>Null handling:</strong> {formatNumber(null)} / {formatCurrency(undefined, "USD")} /{" "}
          {formatPercent(NaN)}
        </Text>
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
          <ErrorState description="Check your network connection." onRetry={() => {}} retrying />
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
              <Table.Head sortable sorted="asc" onSort={() => {}}>
                Name
              </Table.Head>
              <Table.Head>Status</Table.Head>
              <Table.Head sortable numeric onSort={() => {}}>
                Revenue
              </Table.Head>
              <Table.Head numeric>Growth</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Acme Corp</Table.Cell>
              <Table.Cell>
                <Badge variant="success">Active</Badge>
              </Table.Cell>
              <Table.Cell numeric>{formatCurrency(1234567, "USD", { locale: "en-US", decimals: 0 })}</Table.Cell>
              <Table.Cell numeric>{formatPercent(12.3, { locale: "en-US", sign: true })}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Globex Inc</Table.Cell>
              <Table.Cell>
                <Badge variant="warning">Pending</Badge>
              </Table.Cell>
              <Table.Cell numeric>{formatCurrency(456789, "USD", { locale: "en-US", decimals: 0 })}</Table.Cell>
              <Table.Cell numeric>{formatPercent(-3.2, { locale: "en-US", sign: true })}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Initech</Table.Cell>
              <Table.Cell>
                <Badge variant="error">Inactive</Badge>
              </Table.Cell>
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
