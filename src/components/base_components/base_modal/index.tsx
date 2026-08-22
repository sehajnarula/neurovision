import React from 'react';
import FlashMessage from 'react-native-flash-message';
import { Modal, Portal, useTheme } from 'react-native-paper';

type BaseModalProps = {
  visible: boolean;
  children: React.ReactNode;
  onClose: () => void;
  avoidKeyboard?: boolean;
};

const BaseModalComp: React.FC<BaseModalProps> = props => {
  const { visible, children, onClose } = props;
  const theme = useTheme();

  return (
    <Portal theme={theme}>
      <Modal
        visible={visible}
        dismissable
        onDismiss={onClose}
        dismissableBackButton
        theme={theme}
      >
        {children}
        <FlashMessage position={'top'} />
      </Modal>
    </Portal>
  );
};
const BaseModal = React.memo(BaseModalComp);
export default BaseModal;
