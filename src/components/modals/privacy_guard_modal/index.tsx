import MaterialIcon from '@react-native-vector-icons/material-design-icons';
import React from 'react';
import { Modal, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { ms } from 'utilities/scale_utils';

type PrivacyGuardModalProps = {
  visible: boolean;
};

const PrivacyGuardModalComp: React.FC<PrivacyGuardModalProps> = props => {
  const { visible } = props;
  const theme = useTheme();
  return (
    <Modal visible={visible}>
      <View
        style={{
          height: theme.dimensions.height,
          width: theme.dimensions.width,
          backgroundColor: theme.colors.background,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          zIndex: 999,
        }}
      >
        <MaterialIcon name={'eye-off'} size={ms(75)} />
      </View>
    </Modal>
  );
};
const PrivacyGuardModal = React.memo(PrivacyGuardModalComp);
export default PrivacyGuardModal;
