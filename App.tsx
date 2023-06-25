/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
  Alert,
  Button,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from 'react-native';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import nacl from 'tweetnacl';

global.Buffer = require('buffer').Buffer;

function HomeScreen({ navigation }): JSX.Element {
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
                <Text className="text-black dark:text-white">
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
                <Text className="text-black dark:text-white">
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

function ChatScreen({navigation, route}) {
  const [username, setUserName] = React.useState((Math.random() + 1).toString(36).substring(7));
  var ws = React.useRef(new WebSocket(`ws://localhost:8000/api/chat/${route.params.name}/${username}`)).current;
  var nacl = require("tweetnacl")
  nacl.util = require("tweetnacl-util")

  const [nonche, setNonche] = React.useState([]);
  const [secretKey, setSecretKey] = React.useState([]);
  const [chatMessages, setChatMessages] = useState([
    {
        id:"1",
        text: "Welcome to the room",
        datetime: "07:50",
        username: username,
    },
  ]);
  const [messageText, setMessageText] = React.useState('');

  const setWebSocket= (localSecret: Uint8Array, localNonche: Uint8Array) => {
    ws.onopen = () => {
      console.log("Open ")
    };
    ws.onclose = (e) => {
      console.log("close ", e)
    };
    ws.onerror = (e) => {
      console.log("error ", e)
    };
    ws.onmessage = (e) => {
      console.log(e)
      const message = JSON.parse(e.data)
      message.text = nacl.util.encodeUTF8(nacl.secretbox.open(nacl.util.decodeBase64(message.text), localNonche, localSecret));
      setChatMessages(history => [...history, message])
    };
  };
  
  useEffect(() => {
    const createRoomAsync = async (roomName: string) => {
      try {
        const response = await fetch(
          'http://localhost:8000/api/room',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: username,
              room_name: roomName,
            }),
          },
        );
        const json = await response.json();
        setNonche(nacl.util.decodeBase64(json.noche));
        setSecretKey(() => nacl.util.decodeBase64(json.secret_key));
        setWebSocket(nacl.util.decodeBase64(json.secret_key), nacl.util.decodeBase64(json.noche));
      } catch (error) {
        console.error(error);
      }
    };

    const joinRoomAsync = async (roomName: string) => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/room/${roomName}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            }
          },
        );
        const json = await response.json();
        setNonche(nacl.util.decodeBase64(json.noche));
        setSecretKey(() => nacl.util.decodeBase64(json.secret_key));
        setWebSocket(nacl.util.decodeBase64(json.secret_key), nacl.util.decodeBase64(json.noche));
      } catch (error) {
        console.error(error);
      }
    };

    if (route.params.isNew) createRoomAsync(route.params.name);
    else joinRoomAsync(route.params.name);
   
    navigation.setOptions({
      title: route.params.name,
    });
  }, [])

  const submitMessage = () => {
    const msg = nacl.util.decodeUTF8(messageText);
    const box = nacl.secretbox(msg, nonche, secretKey);
    let message = {
      text: nacl.util.encodeBase64(box)
    }
    ws.send(JSON.stringify(message));
    setMessageText('')
  }

  return (
    <KeyboardAvoidingView
      className="bg-neutral-300 dark:bg-slate-900"
      behavior="padding"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className='m-3 mb-16 flex flex-col'>
          <View 
            className='basis-11/12'
          >
              {chatMessages[0] ? (
                  <FlatList
                      data={chatMessages}
                      renderItem={({ item }) => (
                          <MessageComponent item={item} username={username} />
                      )}
                      keyExtractor={item => item.id}
                      nestedScrollEnabled={true}
                  />
              ) : (
                  ""
              )}
          </View>

          <View className="basis-1/12 flex flex-row items-center">
              <TextInput
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-4/5 px-2.5 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder='Say hi!'
                value={messageText}
                onChangeText={setMessageText}
              />
              <Pressable
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 flex flex-row justify-center font-medium ml-1 rounded-lg text-sm w-1/5 sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onPress={submitMessage}
              >
                  <View>
                      <Text>SEND</Text>
                  </View>
              </Pressable>
          </View>
      </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

function MessageComponent({item, username}) {
  const isUserChat = item.username === username;
  const backgroundStyle = isUserChat ? "border-teal-300 text-gray-900 text-sm dark:bg-teal-700 dark:border-teal-600 dark:placeholder-gray-400 dark:text-white" : "border-gray-300 text-gray-900 text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"

  return (
      <View className='m-1'>
          <View
            className={`flex flex-row ${isUserChat ? "justify-end" : "justify-start"}`}
          >
              <View className={backgroundStyle + "flex flex-row items-center p-3 shadow rounded-xl " + (isUserChat ? "ml-10" : "mr-10")}>
                <Text className="text-base">{item.text}</Text>
                <Text className="ml-3 text-xs text-gray-700 dark:text-gray-400">{item.datetime}</Text>
              </View>
             
          </View>
      </View>
  );
}

const Stack = createNativeStackNavigator();
function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{
            title: 'Simple Chat',
            headerStyle: {
              backgroundColor: '#1E313B',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
