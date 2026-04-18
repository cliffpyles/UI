import {
  forwardRef,
  useState,
  type HTMLAttributes,
  type ChangeEvent,
} from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { Icon } from "../../primitives/Icon";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Popover } from "../../components/Popover";
import { defaultPalette, type PaletteColor } from "./palette";
import "./ColorPicker.css";

export interface ColorPickerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: string | null;
  onChange: (color: string | null) => void;
  palette?: PaletteColor[];
  allowCustom?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

const HEX_PATTERN = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

export const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(
  function ColorPicker(
    {
      value,
      onChange,
      palette = defaultPalette,
      allowCustom = false,
      disabled = false,
      placeholder = "Pick color",
      className,
      ...rest
    },
    ref,
  ) {
    const classes = ["ui-color-picker", className].filter(Boolean).join(" ");
    const selected = palette.find((p) => p.value === value) ?? null;
    const isCustom = !!value && !selected;

    const [customDraft, setCustomDraft] = useState(isCustom ? value! : "");
    const [customError, setCustomError] = useState(false);

    function commitCustom(e: ChangeEvent<HTMLInputElement>) {
      const next = e.target.value.trim();
      setCustomDraft(next);
      if (next === "") {
        setCustomError(false);
        return;
      }
      if (HEX_PATTERN.test(next)) {
        setCustomError(false);
        onChange(next);
      } else {
        setCustomError(true);
      }
    }

    const triggerLabel = selected
      ? selected.name
      : isCustom
        ? value
        : placeholder;

    return (
      <Box
        ref={ref as React.Ref<HTMLElement>}
        direction="row"
        align="center"
        gap="2"
        className={classes}
        {...rest}
      >
        <Popover placement="bottom-start">
          <Popover.Trigger asChild>
            <Button variant="ghost" size="md" disabled={disabled}>
              <Box direction="row" align="center" gap="2">
                {value && (
                  <Box
                    aria-hidden="true"
                    className="ui-color-picker__trigger-swatch"
                    style={{ background: value }}
                  />
                )}
                <Text as="span" size="sm" color={value ? "primary" : "secondary"}>
                  {triggerLabel}
                </Text>
              </Box>
            </Button>
          </Popover.Trigger>
          <Popover.Content>
            <Box
              direction="row"
              wrap
              gap="2"
              className="ui-color-picker__grid"
              role="listbox"
              aria-label="Color palette"
            >
              {palette.map((color) => {
                const isSelected = color.value === value;
                return (
                  <Button
                    key={color.value}
                    variant="ghost"
                    size="sm"
                    aria-pressed={isSelected}
                    aria-label={`${color.name} (${color.value})`}
                    onClick={() => onChange(color.value)}
                    className="ui-color-picker__swatch-btn"
                  >
                    <Box direction="row" align="center" gap="1">
                      <Box
                        aria-hidden="true"
                        className="ui-color-picker__swatch"
                        style={{ background: color.value }}
                      />
                      {isSelected && <Icon name="check" size="xs" />}
                    </Box>
                  </Button>
                );
              })}
            </Box>
            {allowCustom && (
              <Box
                direction="column"
                gap="1"
                className="ui-color-picker__custom"
              >
                <Text as="label" size="xs" color="secondary">
                  Custom hex
                </Text>
                <Input
                  size="sm"
                  value={customDraft}
                  onChange={commitCustom}
                  placeholder="#rrggbb"
                  error={customError}
                  aria-invalid={customError || undefined}
                  aria-label="Custom hex color"
                />
                {customError && (
                  <Text as="span" size="xs" color="error">
                    Enter a valid hex (e.g. #3b82f6)
                  </Text>
                )}
              </Box>
            )}
          </Popover.Content>
        </Popover>
      </Box>
    );
  },
);

ColorPicker.displayName = "ColorPicker";
