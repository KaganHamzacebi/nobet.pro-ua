import { NotificationType } from '../enums/NotificationType';
import {
  showErrorNotification,
  showSuccessNotification,
  showWarningNotification
} from '../helpers/notification-service';

export const notificationMap = {
  [NotificationType.Unauthorized]: {
    handler: showWarningNotification,
    title: 'Unauthorized',
    message: 'You should sign in before continuing'
  },
  [NotificationType.LoginSuccess]: {
    handler: showSuccessNotification,
    title: 'Logged In',
    message: 'Successfully logged in'
  },
  [NotificationType.LoginFailed]: {
    handler: showErrorNotification,
    title: 'Login Failed',
    message: 'Check your credentials'
  },
  [NotificationType.SignoutSuccess]: {
    handler: showSuccessNotification,
    title: 'Logged Out',
    message: 'Successfully logged out'
  },
  [NotificationType.SignupFailed]: {
    handler: showErrorNotification,
    title: 'Signup Failed',
    message: 'Signup failed for an unknown reason, please try again later'
  }
};
