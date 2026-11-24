import { View, FlatList, TouchableOpacity } from "react-native";
import BaseText from "components/base_components/base_text";
import { Divider, useTheme } from "react-native-paper";
import { style } from "./style";

const ReportList = (props: any) => {

    const theme = useTheme()
    const styles = style(theme)

    return (

        <View>
            <FlatList
                data={props.data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={(item) => <TouchableOpacity onPress={() => console.log(item.item.id)} style={styles.section}>
                    <BaseText
                        style={[styles.sectionTitle, { color: theme.colors.primary }]}
                    >
                        {props.title}
                    </BaseText>
                    <Divider style={styles.divider} />

                    <BaseText style={styles.itemLabel}>Phone</BaseText>
                    <BaseText style={styles.itemValue}>{item.item.date}</BaseText>

                    <BaseText style={styles.itemLabel}>Address</BaseText>
                    <BaseText style={styles.itemValue}>{item.item.description}</BaseText>
                </TouchableOpacity>}
            />
        </View>
    )
}

export default ReportList;