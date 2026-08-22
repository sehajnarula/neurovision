import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import SpaceView from 'components/atoms/space_view';
import BaseBottomSheetModal from 'components/base_components/base_bottom_sheet_modal';
import BaseText from 'components/base_components/base_text';
import BaseTextInput from 'components/base_components/base_text_input';
import ModalHeader from 'components/molecules/modal_header';
import React, { useCallback, useRef } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { Icon, TextInput, useTheme } from 'react-native-paper';
import { MaterialIcon } from 'utilities/constants';
import { ms } from 'utilities/scale_utils';
import { style } from './style';

type BottomSheetDropDownProps<T> = {
  label?: string;
  placeholder?: string;
  headerTitle: string;
  data: T[];
  keyExtractor: (item: T) => string | number;
  renderLabel?: (item: T) => string;
  onSelect?: (item: T) => void;
  selectedValue?: T | null;
  errorValue?: string;
  listEmptyMsg?: string;
};

function BottomSheetDropDownComponent<T>({
  headerTitle = '',
  label,
  placeholder = 'Select...',
  data,
  keyExtractor,
  renderLabel = item => String(item),
  onSelect,
  selectedValue,
  errorValue = '',
  listEmptyMsg,
}: BottomSheetDropDownProps<T>) {
  const theme = useTheme();
  const styles = style(theme);
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // Present sheet
  const handlePresent = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  // Handle item selection
  const handleSelect = useCallback(
    (item: T) => {
      bottomSheetRef.current?.dismiss();
      onSelect?.(item);
    },
    [onSelect],
  );

  // Render list item
  const renderItem = useCallback(
    ({ item }: { item: T }) => {
      const isSelected =
        selectedValue && keyExtractor(selectedValue) === keyExtractor(item);

      return (
        <Pressable onPress={() => handleSelect(item)} style={styles.listItem}>
          <BaseText>{renderLabel(item)}</BaseText>
          {isSelected && (
            <Icon
              source="circle-check"
              size={ms(30)}
              color={theme.colors.primary}
            />
          )}
        </Pressable>
      );
    },
    [handleSelect, selectedValue, keyExtractor, renderLabel, theme.colors],
  );

  return (
    <View style={{ width: '100%' }}>
      <Pressable onPress={handlePresent}>
        <BaseTextInput
          label={label}
          placeholder={placeholder}
          editable={false}
          value={selectedValue ? renderLabel(selectedValue) : ''}
          errorValue={errorValue}
          pointerEvents="none"
          right={
            <TextInput.Icon
              icon={MaterialIcon.CHEVRON_DOWN}
              onPress={handlePresent}
            />
          }
        />
      </Pressable>

      <BaseBottomSheetModal reff={bottomSheetRef}>
        <BottomSheetView style={styles.listContainer}>
          <ModalHeader
            title={headerTitle}
            onClose={() => bottomSheetRef?.current?.dismiss()}
          />
          <FlatList
            data={data}
            keyExtractor={(_, index) => index?.toString()}
            renderItem={renderItem}
            ListFooterComponent={
              <SpaceView height={theme.dimensions.height * 0.1} />
            }
            ListEmptyComponent={
              <BaseText
                variant="titleMedium"
                style={{
                  width: '100%',
                  textAlign: 'center',
                  paddingTop: ms(25),
                }}
              >
                {listEmptyMsg || 'No Filter Data Found!'}
              </BaseText>
            }
          />
        </BottomSheetView>
      </BaseBottomSheetModal>
    </View>
  );
}

// Memoize the component itself
const BottomSheetDropDown = React.memo(
  BottomSheetDropDownComponent,
) as typeof BottomSheetDropDownComponent;

export default BottomSheetDropDown;
