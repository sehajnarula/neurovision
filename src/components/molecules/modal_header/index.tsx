import BaseText from 'components/base_components/base_text';
import React from 'react';
import { View } from 'react-native';
import { Icon, useTheme } from 'react-native-paper';
import { ms } from 'utilities/scale_utils';
import BounceView from '../bounce_view';
import { style } from './style';

type ModalHeaderCompProps = {
  title: string;
  onClose: () => void;
};

const ModalHeaderComp: React.FC<ModalHeaderCompProps> = props => {
  const { title, onClose } = props;
  const theme = useTheme();
  const viewStyle = style(theme);

  return (
    <View style={viewStyle.mainConatiner}>
      <BaseText variant="titleMedium" style={viewStyle.headingTextUserName}>
        {title}
      </BaseText>
      <BounceView style={viewStyle.closeIcon} onPress={onClose}>
        <Icon
          source={'close'}
          size={ms(20)}
          color={theme.colors.iconColor.white}
        />
      </BounceView>
    </View>
  );
};
const ModalHeader = React.memo(ModalHeaderComp);
export default ModalHeader;
