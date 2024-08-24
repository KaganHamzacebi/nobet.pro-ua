import { NumberInput } from "@mantine/core";

export const SectionCellRenderer = () => {
  return (
      <div className="w-full min-w-[200px]">
        <NumberInput defaultValue={0}
                     size="xs"
                     allowNegative={false}
        />
      </div>
  )
}