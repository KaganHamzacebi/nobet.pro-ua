import { useCallback, useState } from 'react';
import { ISection } from '../models/ISection';

export const useSectionList = (defaultList: ISection[]) => {
  const [sectionList, setSectionList] = useState(defaultList);

  const addSection = useCallback(() => {
    setSectionList(prevState => [
      ...prevState,
      newSection(`New Section - ${prevState.length + 1}`)
    ]);

    setRerenderColumns(prev => !prev);
  }, []);

  const removeSection = useCallback((sectionId: ISection['id']) => {
    setSectionList(prevState => prevState.filter(i => i.id !== sectionId));
    setRerenderColumns(prev => !prev);
  }, []);

  const setSectionProps = useCallback((sectionId: ISection['id'], props: Partial<ISection>) => {
    setSectionList(prevState =>
      prevState.map(section => (section.id === sectionId ? { ...section, ...props } : section))
    );
  }, []);
};
