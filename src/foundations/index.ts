/**
 * Foundation display components for Storybook design token documentation.
 * These are Storybook-only helpers -- not used in application UI.
 *
 * @see components/foundations/token-swatch.tsx — color swatch display
 * @see components/foundations/token-row.tsx — scale row with visual bar
 * @see components/foundations/type-specimen.tsx — type sample with metrics
 */
export { TokenSwatch, type TokenSwatchProps } from "./token-swatch";
export { TokenRow, type TokenRowProps } from "./token-row";
export { TypeSpecimen, type TypeSpecimenProps } from "./type-specimen";
export {
  ColorTokenTable,
  type ColorTokenDef,
  type ColorTokenTableProps,
} from "./color-token-table";
export {
  SizeTokenTable,
  type SizeTokenDef,
  type SizeTokenSample,
  type SizeTokenTableProps,
} from "./size-token-table";
export { Slot, type SlotProps, type SlotVariant } from "./slot";
