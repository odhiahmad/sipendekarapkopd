import React, {useContext, useEffect, useState,useReducer,useMemo} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from './src/HomeScreen'
import Login from './src/Login'
import DataBelumDisetujui from "./src/DataBelumDisetujui";
import DataBelumDisetujuiDetail from "./src/DataBelumDisetujuiDetail";
import DataSudahDisetujui from "./src/DataSudahDisetujui";
import DataSudahDisetujuiDetail from "./src/DataSudahDisetujuiDetail";
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import * as SplashScreen from 'expo-splash-screen';
import {stateConditionString} from './src/utils/helpers';
import {AuthContext} from './src/utils/authContext';
import {initialState, reducer} from "./src/reducers/reducer";
import {baseApi} from "./src/services/api";
import AsyncStorage from '@react-native-async-storage/async-storage';
const Stack = createStackNavigator();


function Auth({}) {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
                name="Login"
                component={Login}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
}


const createHomeStack = () => {


    return (
        <Stack.Navigator>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
                name="HomeScreen"
                component={HomeScreen}

            />
            <Stack.Screen name="DataBelumDisetujui" options={{
                headerShown: false,
            }} component={DataBelumDisetujui}/>
            <Stack.Screen name="DataBelumDisetujuiDetail" options={{
                headerShown: false,
            }} component={DataBelumDisetujuiDetail}/>
            <Stack.Screen name="DataSudahDisetujui" options={{
                headerShown: false,
            }} component={DataSudahDisetujui}/>

            <Stack.Screen name="DataSudahDisetujuiDetail" options={{
                headerShown: false,
            }} component={DataSudahDisetujuiDetail}/>
        </Stack.Navigator>
    );
};


export default App = ({navigation}) => {

    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        // Fetch the token from storage then navigate to our appropriate place
        const bootstrapAsync = async () => {
            let userToken;

            try {
                userToken = await AsyncStorage.getItem('token');
                idKab = await AsyncStorage.getItem('id_kab');
            } catch (e) {
                // Restoring token failed
            }

            // After restoring token, we may need to validate it in production apps
            // This will switch to the App screen or Auth screen and this loading
            // screen will be unmounted and thrown away.
            console.log(userToken)
            dispatch({type: 'RESTORE_TOKEN', token: userToken,id_kab:idKab});
        };
        bootstrapAsync();
    }, []);

    // In a production app, we need to send some data (usually username, password) to server and get a token
    // We will also need to handle errors if sign in failed
    // After getting token, we need to persist the token using `AsyncStorage`
    const authContextValue = useMemo(
        () => ({
            signIn: async (data) => {
                if (
                    data &&
                    data.username !== undefined &&
                    data.password !== undefined
                ) {

                    return fetch(baseApi + 'login', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            username: data.username,
                            password: data.password
                        })
                    })
                        .then((response) => response.json())
                        .then((json) => {

                            if (json.status === true) {
                                console.log(json.token)

                                dispatch({type: 'SIGN_IN', token: json.token, id_kab: json.id_kab});
                                 AsyncStorage.setItem('token',json.token)
                                AsyncStorage.setItem('id_kab',json.id_kab)
                                // this.setState({
                                //     loading: false
                                // });

                            } else {
                                alert(json.message)
                                // this.setState({
                                //     password: '',
                                //     loading: false
                                // })
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                            alert('Anda sedang tidak terhubung ke jaringan internet')
                        });


                } else {
                    dispatch({type: 'TO_SIGNIN_PAGE'});
                }
            },
            signOut: async (data) => {
                AsyncStorage.clear()
                dispatch({type: 'SIGN_OUT'});
            },

            signUp: async (data) => {
                if (
                    data &&
                    data.emailAddress !== undefined &&
                    data.password !== undefined
                ) {
                    dispatch({type: 'SIGNED_UP', token: 'dummy-auth-token'});
                } else {
                    dispatch({type: 'TO_SIGNUP_PAGE'});
                }
            },
        }),
        [],
    );

    const chooseScreen = (state) => {
        let navigateTo = stateConditionString(state);
        let arr = [];

        switch (navigateTo) {
            case 'LOAD_SIGNIN':
                arr.push(<Stack.Screen options={{
                    headerShown: false,
                }} name="Login" component={Login} />);
                break;

            case 'LOAD_HOME':
                arr.push(
                    <Stack.Screen
                        name="Home"
                        component={createHomeStack}
                        options={{
                            headerShown: false,
                        }}
                    />,
                );
                break;
            default:
                arr.push(<Stack.Screen options={{
                    headerShown: false,
                }} name="Login" component={Login} />);
                break;
        }
        return arr[0];
    };


        return (
            <AuthContext.Provider value={authContextValue}>
                <NavigationContainer>
                    <Stack.Navigator>{chooseScreen(state)}</Stack.Navigator>
                </NavigationContainer>
            </AuthContext.Provider>
        );

}


