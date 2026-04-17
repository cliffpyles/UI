import { useState } from "react";
import { Box } from "../../primitives/Box";
import { Icon } from "../../primitives/Icon";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Checkbox } from "../../components/Checkbox";
import { Radio, RadioGroup } from "../../components/Radio";
import { Toggle } from "../../components/Toggle";
import { Select } from "../../components/Select";
import { Tag } from "../../components/Tag";
import { Avatar } from "../../components/Avatar";
import { Tooltip } from "../../components/Tooltip";
import { Skeleton } from "../../components/Skeleton";
import { Demo } from "../components/Demo";

export default function BaseComponents() {
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

      <Demo title="Button" description="Variants, sizes, loading, disabled, and link-as-button.">
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
          <Button as="a" href="#">
            Link Button
          </Button>
        </Box>
      </Demo>

      <Demo title="Input" description="Controlled, sizes, error, disabled, icons, and addons.">
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
          <Input leadingIcon={<Icon name="search" size="sm" />} placeholder="With icon" aria-label="Search" />
          <Input leadingAddon="https://" trailingAddon=".com" placeholder="domain" aria-label="Domain" />
        </Box>
      </Demo>

      <Demo title="Checkbox" description="Controlled, indeterminate, disabled, with description.">
        <Box display="flex" direction="column" gap="2">
          <Checkbox checked={checkboxChecked} onChange={setCheckboxChecked} label="Controlled checkbox" />
          <Checkbox defaultChecked label="Default checked" />
          <Checkbox indeterminate label="Indeterminate" />
          <Checkbox disabled label="Disabled" />
          <Checkbox label="With description" description="Additional information about this option" />
        </Box>
      </Demo>

      <Demo title="Radio" description="Radio group with label, description, and disabled option.">
        <RadioGroup value={radioValue} onChange={setRadioValue} aria-label="Fruits">
          <Radio value="apple" label="Apple" />
          <Radio value="banana" label="Banana" />
          <Radio value="cherry" label="Cherry" description="A sweet red fruit" />
          <Radio value="durian" label="Durian" disabled />
        </RadioGroup>
      </Demo>

      <Demo title="Toggle" description="On/off switch with sizes and disabled state.">
        <Box display="flex" direction="column" gap="2">
          <Toggle checked={toggleChecked} onChange={setToggleChecked} label="Feature toggle" />
          <Toggle defaultChecked label="Default on" />
          <Toggle size="sm" label="Small toggle" />
          <Toggle disabled label="Disabled" />
        </Box>
      </Demo>

      <Demo title="Select" description="Native-style select with sizes, error, and disabled.">
        <Box display="flex" direction="column" gap="3" style={{ maxWidth: "320px" }}>
          <Select options={selectOptions} value={selectValue} onChange={setSelectValue} aria-label="Fruit" />
          <Select options={selectOptions} placeholder="Choose a fruit..." aria-label="Fruit placeholder" />
          <Select options={selectOptions} size="sm" aria-label="Small select" />
          <Select options={selectOptions} size="lg" aria-label="Large select" />
          <Select options={selectOptions} error aria-label="Error select" />
          <Select options={selectOptions} disabled aria-label="Disabled select" />
        </Box>
      </Demo>

      <Demo title="Tag" description="Status variants, sizes, and removable tags.">
        <Box display="flex" gap="2" align="center">
          <Tag variant="neutral">Neutral</Tag>
          <Tag variant="primary">Primary</Tag>
          <Tag variant="success">Success</Tag>
          <Tag variant="warning">Warning</Tag>
          <Tag variant="error">Error</Tag>
        </Box>
        <Box display="flex" gap="2" align="center" style={{ marginTop: "var(--spacing-2)" }}>
          <Tag size="sm">Small</Tag>
          <Tag removable onRemove={() => {}}>
            Removable
          </Tag>
        </Box>
      </Demo>

      <Demo title="Avatar" description="Image, initials, fallback, and shape variants.">
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
      </Demo>

      <Demo title="Tooltip" description="Positioning on top, bottom, left, and right.">
        <Box display="flex" gap="4" align="center">
          <Tooltip content="I'm on top" side="top">
            <Button variant="secondary" size="sm">
              Top
            </Button>
          </Tooltip>
          <Tooltip content="I'm on the bottom" side="bottom">
            <Button variant="secondary" size="sm">
              Bottom
            </Button>
          </Tooltip>
          <Tooltip content="I'm on the left" side="left">
            <Button variant="secondary" size="sm">
              Left
            </Button>
          </Tooltip>
          <Tooltip content="I'm on the right" side="right">
            <Button variant="secondary" size="sm">
              Right
            </Button>
          </Tooltip>
        </Box>
      </Demo>

      <Demo title="Skeleton" description="Loading placeholders: text lines, circle, and rect.">
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
      </Demo>
    </section>
  );
}
