import { useEffect, useState } from "react";
import { FlatList, Keyboard, KeyboardAvoidingView, Pressable, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import MessageComponent from "./Components/Message.Component";
import React from "react";
import { RootScreenProps, RootStackParamList } from "../../type";

// interface ChatScreenProps {
//     navigation: NativeStackNavigationProp<RootStackParamList, "Chat">;
//     route: RouteProp<RootStackParamList, "Chat">
// }

const ChatScreen: React.FC<RootScreenProps<'Chat'>> = ({navigation, route}) => {
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
        className="bg-neutral-300 dark:bg-slate-900 h-full"
        behavior="height"
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
                        <Text className="text-white">Send</Text>
                    </View>
                </Pressable>
            </View>
        </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
}

export default ChatScreen;