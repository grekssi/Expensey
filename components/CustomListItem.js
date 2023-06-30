import { View, Text } from 'react-native'
import React from 'react'
import { Avatar, ListItem } from 'react-native-elements'

const CustomListItem = ({id, chatName, enterChat}) => {
    return (
        <ListItem>
            {/* <Avatar rounded source={{ uri: "https://seeklogo.com/images/S/signal-logo-20A1616F60-seeklogo.com.png" }} />

            <ListItem.Content>
                <ListItem.Title style={{ fontWeight: "800" }}>Youtube chat</ListItem.Title>

                <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                    This is a test subtitle
                </ListItem.Subtitle>
            </ListItem.Content> */}
        </ListItem>
    )
}

export default CustomListItem