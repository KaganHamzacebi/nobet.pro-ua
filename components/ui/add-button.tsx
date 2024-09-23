import AddIcon from '@/components/icons/Add';
import { Button } from '@mantine/core';

interface IAddButton {
  onClick?: () => void;
  label?: string;
}

export default function AddButton({ label, onClick }: Readonly<IAddButton>) {
  return (
    <Button className="add-button" leftSection={<AddIcon />} onClick={onClick}>
      {label}
    </Button>
  );
}
