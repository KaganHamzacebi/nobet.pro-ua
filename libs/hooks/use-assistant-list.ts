import { SetStateAction, useCallback, useState } from 'react';
import { GenerateUUID } from '../helpers/id-generator';
import { newAssistant } from '../helpers/model-generator';
import { IAssistant } from '../models/IAssistant';
import { SelectedDayConfig } from '../models/NobetContext';

export const useAssistantList = (
  defaultList: IAssistant[],
  setSelectedDayConfig: (value: SetStateAction<SelectedDayConfig>) => void
) => {
  const [assistantList, setAssistantList] = useState(defaultList);

  const addNewAssistant = useCallback(() => {
    setAssistantList(prevState => [
      ...prevState,
      newAssistant(`New Assistant - ${prevState.length + 1}`)
    ]);
  }, []);

  const removeAssistant = useCallback((assistant: IAssistant) => {
    setAssistantList(prevState => prevState.filter(a => a.id !== assistant.id));
    setSelectedDayConfig(prevState => {
      Object.entries(assistant.selectedDays.days).forEach(([dayIndex, section]) => {
        const selectedDayConfig = prevState[Number(dayIndex)];
        selectedDayConfig.sectionIds.delete(section.id);
        selectedDayConfig.version = GenerateUUID();
      });

      return prevState;
    });
  }, []);

  const setAssistantProps = useCallback(
    (assistantId: IAssistant['id'], props: Partial<IAssistant>) => {
      setAssistantList(prevState =>
        prevState.map(assistant =>
          assistant.id === assistantId ? { ...assistant, ...props } : assistant
        )
      );
    },
    []
  );

  return {
    assistantList,
    setAssistantList,
    addNewAssistant,
    removeAssistant,
    setAssistantProps
  };
};
