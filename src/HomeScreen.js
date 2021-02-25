import {ImageBackground, ScrollView, Text, TouchableOpacity, View} from "react-native";
import React, {useContext} from "react";
import {Icon} from 'react-native-elements';
import {AuthContext} from "./utils/authContext";


export default function HomeScreen({navigation}) {


    const {signOut} = useContext(AuthContext);

        return (
            <ImageBackground
                source={require("./images/back.png")}
                style={{width: "100%", height: "100%"}}
            >
               

                <View style={{paddingHorizontal: 40, marginTop: 80}}>
                    <Text
                        style={{
                            fontSize: 40,
                            color: "#522289",
                        }}
                    >
                        Hello
                    </Text>
                    <Text
                        style={{
                            fontSize: 15,
                            paddingVertical: 10,
                            paddingRight: 80,
                            lineHeight: 22,
                            color: "#a2a2db",
                        }}
                    >
                        Selamat Datang di SIPENDEKAR Sistem Pendeteksi Kebakaran
                    </Text>
                    {/*<View*/}
                    {/*    style={{*/}
                    {/*        flexDirection: "row",*/}
                    {/*        backgroundColor: "#FFF",*/}
                    {/*        borderRadius: 40,*/}
                    {/*        alignItems: "center",*/}
                    {/*        paddingVertical: 10,*/}
                    {/*        paddingHorizontal: 20,*/}
                    {/*        marginTop: 30,*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    <Image*/}
                    {/*        source={require("./images/search.png")}*/}
                    {/*        style={{height: 14, width: 14}}*/}
                    {/*    />*/}
                    {/*    <TextInput*/}
                    {/*        placeholder="Lorem ipsum"*/}
                    {/*        style={{paddingHorizontal: 20, fontSize: 15, color: "#ccccef"}}*/}
                    {/*    />*/}
                    {/*</View>*/}

                    <View style={{flexDirection: "row", marginTop: 350}}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("DataBelumDisetujui")}
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                                height: 100,
                                width: 120,

                            }}>
                            <View

                                style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: 66,
                                    width: 66,
                                    borderRadius: 50,
                                    backgroundColor: "#5facdb",
                                }}
                            >
                                <Icon type='font-awesome-5' name='briefcase' color='#fff'
                                />
                            </View>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: "gray",
                                }}
                            >Data Laporan</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("DataSudahDisetujui")}
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                                height: 100,
                                width: 120,

                            }}>
                            <View

                                style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: 66,
                                    width: 66,
                                    borderRadius: 50,
                                    backgroundColor: "#ff5c83",
                                    marginHorizontal: 22,
                                }}
                            >
                                <Icon type='font-awesome-5' name='clipboard-check' color='#fff'
                                />
                            </View>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: "gray",
                                }}
                            >Data di Setujui</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={()=>signOut()}
                            style={{
                            alignItems: "center",
                            justifyContent: "center",
                            height: 100,
                            width: 120,

                        }}>
                            <View
                                style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: 66,
                                    width: 66,
                                    borderRadius: 50,
                                    backgroundColor: "#fa5c83",
                                    marginHorizontal: 22,
                                }}
                            >
                                <Icon type='font-awesome-5' name="sign-out-alt" color='#fff'
                                />
                            </View>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: "gray",
                                }}
                            >Keluar</Text>
                        </TouchableOpacity>


                    </View>


                </View>
            </ImageBackground>
        );

}
