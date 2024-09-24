import { notifications } from '@mantine/notifications';

interface NotificationProps {
  title: string;
  message: string;
}

const showSuccessNotification = ({ title, message }: NotificationProps) => {
  notifications.show({
    title: title,
    message: message
  });
};

export { showSuccessNotification };
