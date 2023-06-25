import { Text, View } from "react-native";
import { MessageProp } from "../../../type";

export default function MessageComponent({item, username}: MessageProp) {
    const isUserChat = item.username === username;
    const backgroundStyle = isUserChat ? "border-teal-300 text-sm bg-teal-700 border-teal-600 ml-10" : "border-gray-300 text-sm bg-gray-700 border-gray-600 mr-10"
  
    return (
        <View className='m-1'>
            <View
              className={`flex flex-row ${isUserChat ? "justify-end" : "justify-start"}`}
            >
                <View className={backgroundStyle + " text-white flex flex-row items-center p-3 shadow rounded-xl"}>
                  <Text className="text-white dark:text-gray-200 text-base">{item.text}</Text>
                  <Text className="ml-3 text-xs text-gray-300 dark:text-gray-400">{item.datetime}</Text>
                </View>
            </View>
        </View>
    );
  }