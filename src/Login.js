import React, {useContext, useEffect, useState,useReducer} from 'react';
import {Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {CheckBox} from 'react-native-elements'
import {validateAll} from 'indicative/validator';
import {AuthContext} from './utils/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseApi} from "./services/api";

const Login = ({navigation}) => {

    const [hidePassword, sethidePassword] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [SignUpErrors, setSignUpErrors] = useState({});

    const {signIn, signUp} = useContext(AuthContext);

    // const reset = () => {
    //     this.props.navigation.navigate('HomeScreen');
    // }


    const setPasswordVisibility = () => {
        sethidePassword(!hidePassword)
    }

    const handleSignIn = () => {

        // https://indicative.adonisjs.com
        const rules = {
            username: 'required',
            password: 'required|string|min:3|max:40'
        };

        const data = {
            username: username,
            password: password
        };

        const messages = {
            required: field => `${field} is required`,
            'username.alpha': 'Username contains unallowed characters',
            'password': 'Wrong Password?'
        };

        validateAll(data, rules, messages)
            .then(() => {
                signIn({username, password});
            })
            .catch(err => {

                const formatError = {};
                err.forEach(err => {
                    alert(err.message)
                    formatError[err.field] = err.message;
                });
                setSignUpErrors(formatError);
            });
    };


    return (
        <View style={styles.mainBody}>

            <View style={styles.logoContainer}>
                <View style={styles.SectionStyle}>
                    <TextInput
                        value={username}
                        placeholder="NIP / Username"
                        onChangeText={setUsername}
                        underlineColorAndroid='transparent'
                        style={styles.inputStyle}
                        errorMessage={SignUpErrors ? SignUpErrors.username : null}
                    />
                </View>
                <View style={styles.SectionStyle}>
                    <TextInput
                        value={password}
                        placeholder="Password"
                        onChangeText={setPassword}
                        keyboardType="default"
                        underlineColorAndroid='transparent'
                        style={styles.inputStyle}
                        secureTextEntry={hidePassword}
                        errorMessage={SignUpErrors ? SignUpErrors.password : null}
                    />
                </View>
                <View style={styles.checkboxContainer}>
                    <CheckBox
                        center
                        title='Lihat Password'
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        checked={!hidePassword}
                        onPress={() => setPasswordVisibility()}
                    />
                </View>
                <TouchableOpacity
                    style={styles.buttonStyle}
                    activeOpacity={0.5}
                    onPress={() => handleSignIn()}>
                    <Text style={styles.buttonTextStyle}>Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

};
export default Login;
const styles = StyleSheet.create({
    checkboxContainer: {
        flexDirection: "row",
        marginBottom: 20,
    },
    checkbox: {
        alignSelf: "flex-start",
    },
    label: {
        margin: 8,
    },
    textBoxContainer: {
        position: 'relative',
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    textBox: {
        fontSize: 20,
        alignSelf: 'stretch',
        height: 45,
        paddingRight: 45,
        paddingLeft: 8,
        borderWidth: 1,
        paddingVertical: 0,
        borderColor: 'grey',
        borderRadius: 5,
    },
    touachableButton: {
        position: 'absolute',
        right: 3,
        height: 40,
        width: 35,
        padding: 2
    },
    mainBody: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    indicator: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 80
    },
    SectionStyle: {
        flexDirection: 'row',
        height: 40,
        marginTop: 20,
        marginLeft: 35,
        marginRight: 35,
        margin: 10,
    },
    logoContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        height: Dimensions.get('window').height / 1
    },
    buttonStyle: {
        backgroundColor: '#00AEEF',
        borderWidth: 0,
        color: '#FFFFFF',
        borderColor: '#00AEEF',
        height: 40,
        width: 100,
        alignItems: 'center',
        borderRadius: 10,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 20,
        marginBottom: 20,
    },
    buttonTextStyle: {
        color: '#FFFFFF',
        paddingVertical: 10,
        fontSize: 16,
    },
    inputStyle: {
        flex: 1,
        color: 'black',
        paddingLeft: 15,
        paddingRight: 15,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'gray',
    }
});

