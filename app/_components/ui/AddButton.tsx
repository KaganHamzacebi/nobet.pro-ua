import AddIcon from '@/components/icons/Add';
import { Button } from '@mantine/core';
import { FC } from 'react';

interface IAddButtonProps {
  onClick?: () => void;
  label?: string;
}

export const AddButton: FC<IAddButtonProps> = ({ label, onClick }) => {
  return (
    <Button className="add-button" leftSection={<AddIcon />} onClick={onClick}>
      {label}
    </Button>
  );
};
