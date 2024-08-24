import { FC, useContext } from 'react';
import { ISection } from '@/models/ISection';
import { ActionIcon, ColorSwatch, NumberInput, Table, TextInput } from '@mantine/core';
import { IAssistant } from '@/models/IAssistant';
import { TrashSolidIcon } from '@/components/icons/TrashSolid';
import { KeyOf, TypeOfKey } from '@/libs/interfaces/utils';
import { NobetContext } from '@/components/ui/NobetScheduler';

interface IAreaEditorProps {
}

export const AreaEditor: FC<IAreaEditorProps> = ({}) => {
  const { sectionList, setSectionList, assistantList, dutyList, setDutyList } = useContext(NobetContext);

  const onSectionChange = <T extends KeyOf<ISection>>(
    fields: Record<T, TypeOfKey<T, ISection>>,
    section: ISection
  ) => {
    const updatedSectionList = sectionList.map((item) =>
      item.id === section.id ? { ...item, ...fields } : item
    );

    setSectionList(updatedSectionList);
  };

  const removeSection = (section: ISection) => {
    setSectionList(
      sectionList.filter(s => s.id !== section.id)
    );

    setDutyList(
      dutyList.filter(duty => duty.area.id !== section.id)
    );
  };

  const setDutyCount = (count: number, assistant: IAssistant, section: ISection) => {
    setDutyList(
      dutyList.map(duty => (
        (duty.assistant === assistant && duty.area === section) ? { ...duty, dayCount: count } : duty
      ))
    );
  };

  const columns = sectionList.map((section, sectionIndex) =>
    <Table.Th key={sectionIndex} className="bg-blackRock w-[210px]">
      <div className="w-[200px] flex flex-row gap-x-2 items-center">
        <TextInput defaultValue={section.name}
                   size="xs"
                   className="w-full"
                   onChange={(e) => onSectionChange({ name: e.target.value }, section)}
        />
        <ColorSwatch size="24px" color={section.color} />
        {sectionList.length > 1 &&
          <ActionIcon size="sm" variant="transparent" onClick={() => removeSection(section)}>
            <TrashSolidIcon className="text-attention" />
          </ActionIcon>
        }
      </div>
    </Table.Th>
  );

  const rows = assistantList.map((assistant) => (
    <Table.Tr key={assistant.id}>
      {
        sectionList.map((section, i) => (
          <Table.Td key={i}>
            <NumberInput defaultValue={0}
                         min={0}
                         onChange={(e) => setDutyCount(Number(e), assistant, section)}
            />
          </Table.Td>
        ))
      }
    </Table.Tr>
  ));

  return (
    <Table stickyHeader horizontalSpacing={8} verticalSpacing={4} withRowBorders={false}>
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
};

