import { useState } from "react";
import { useColorScheme, SafeAreaView, StatusBar, ScrollView, View, TextInput, Text, Pressable } from "react-native";
import {RootScreenProps, RootStackParamList} from "../../type"

const HomeScreen: React.FC<RootScreenProps<'Home'>> = ({ navigation }): JSX.Element => {
    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = "bg-neutral-300 dark:bg-slate-900"
    const [room, setRoom] = useState('');
    const [existingRoom, setExistingRoom] = useState('');
  
    return (
      <SafeAreaView className={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          className={backgroundStyle}>
          <View
            className="bg-white dark:bg-slate-900 container gap-y-3 px-10 h-screen justify-center items-center"
          >
            <View className="flex flex-col gap-y-2">
              <Text className="text-sm">
                Create Room
              </Text>
              <View className="flex flex-row gap-x-3 items-center">
                <TextInput
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-3/5 px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder='Enter your room name'
                  value={room}
                  onChangeText={setRoom}
                />
                <Pressable 
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 flex flex-row justify-center font-medium rounded-lg text-sm w-2/6 sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onPress={() =>
                    navigation.navigate('Chat', {name: room, isNew: true})
                  }
                >
                  <Text className="text-white">
                    Create
                  </Text>
                </Pressable>
              </View>
            </View>
  
            <View className="flex flex-col gap-y-2">
              <Text className="text-sm">
                or Join Room
              </Text>
              <View className="flex flex-row gap-x-3 items-center">
                <TextInput
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-3/5 px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder='Enter existing room name'
                  value={existingRoom}
                  onChangeText={setExistingRoom}
                />
                <Pressable 
                  className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 flex flex-row justify-center font-medium rounded-lg text-sm w-2/6 sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                  onPress={() =>
                    navigation.navigate('Chat', {name: existingRoom, isNew: false})
                  }
                >
                  <Text className="text-white">
                    Join
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  export default HomeScreen;