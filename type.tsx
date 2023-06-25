import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
    Home: undefined;
    Chat: ChatParamListt;
}

export type RootScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>
  
type ChatParamListt = {
    isNew: Boolean;
    name: string;
}

export type MessageProp = {
    item: ChatModel,
    username: string,
}

export type ChatModel = {
    id: string,
    text: string,
    datetime: string,
    username: string,
}