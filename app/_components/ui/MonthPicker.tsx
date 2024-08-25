import { MonthCellRenderer } from '@/components/ui/MonthCellRenderer';
import { FC, memo, useContext } from 'react';
import { NobetContext } from '@/components/ui/NobetScheduler';
import { IAssistant } from '@/models/IAssistant';
import { Table } from '@mantine/core';

interface IMonthPickerProps {
  assistantList: IAssistant[];
}

export const MonthPicker: FC<IMonthPickerProps> = memo(({ assistantList }) => {
    const { monthConfig } = useContext(NobetContext);

    const columns = Array.from({ length: monthConfig.datesInMonth ?? 0 }).map((_, dayIndex) =>
      <Table.Th key={dayIndex}
                className={`text-center border border-onyx-50 ${monthConfig.weekendIndexes.includes(dayIndex + 1) ? 'bg-onyx' : 'bg-cinder'}`}>
        <span key={dayIndex}>{dayIndex + 1}</span>
      </Table.Th>
    );

    const rows = assistantList.map((assistant) => (
      <Table.Tr key={assistant.id}>
        {
          Array.from({ length: monthConfig.datesInMonth ?? 0 }).map((_, i) => (
            <Table.Td key={i}>
              <MonthCellRenderer key={i}
                                 dayIndex={i + 1}
                                 assistant={assistant}
              />
            </Table.Td>
          ))
        }
      </Table.Tr>
    ));

    return (
      <Table stickyHeader horizontalSpacing={0} verticalSpacing={4} withRowBorders={false}>
        <Table.Thead>
          <Table.Tr>
            {columns}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows}
        </Table.Tbody>
      </Table>
    );
  }
);