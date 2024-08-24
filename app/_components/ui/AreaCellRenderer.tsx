import { NumberInput } from "@mantine/core";

export const AreaCellRenderer = () => {
  return (
      <div className="w-full min-w-[200px]">
        <NumberInput defaultValue={0}
                     size="xs"
                     allowNegative={false}
        />
      </div>
  )
}