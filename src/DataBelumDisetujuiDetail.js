import {
    ActivityIndicator, Alert,
    Dimensions,
    FlatList,
    Image,
    Modal, ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import React, {Component} from "react";
import {Avatar, Button, Header, Icon, ListItem} from 'react-native-elements';
import Ripple from "react-native-material-ripple";
import LoaderModal from "./components/LoaderModal";
import {baseApi} from "./services/api";
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView from "react-native-maps";
import jwt_decode from "jwt-decode";

require('moment/locale/id.js');
export default class DataBelumDisetujuiDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingModal: false,
            loading: false,
            showTryAgain: false,
            isLoading: true,
            dataSource: null,
            data: [],
            dataDetail: [],
            isLoadingDataModal: true,
            isModalVisible: false,
            modalVisible: false,
            urlImage: '',
            searchAktif: 0,
            id_kab:'',
            user_token:'',
            token:'',
            id_user:'',
        };



    }

    componentDidMount() {
        const { dataItem } = this.props.route.params;

        this.setState({
            dataDetail:dataItem
        })
    }


    yaLanjut = () => {
        this.setState({
            loading: true,
        })

        console.log({
            pelaporan_id:this.state.dataDetail.id,
            id_user:this.state.id_user,
            user_token:this.state.token,
            status:1
        })
        return fetch(baseApi + 'verifikasi', {
            method: 'POST',
            headers: {
                Accept: '*/*',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + this.state.token,
            },
            body: {
                pelaporan_id: this.state.dataDetail.id,
                id_user: this.state.id_user,
                user_token: this.state.token,
                status: 1
            }
        })
            .then((response) => response.json())
            .then((json) => {
                this.setState({
                    loading: false,
                })
                alert('Anda sedang tidak terhubung ke jaringan internet')
            })
            .catch((error) => {
                this.setState({
                    loading: false,
                })
                console.error(error);
                alert('Anda sedang tidak terhubung ke jaringan internet')
            });

    }
       tindakLanjuti = () => {
        Alert.alert(
            "Pesan",
            "Apakah anda yakin ingin menindak lanjuti pengaduan ini ?",
            [

                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                // {
                //     text: "Tidak",
                //     onPress: () => console.log("Ask me later pressed")
                // },
                { text: "Ya", onPress: () => this.yaLanjut()}
            ],
            { cancelable: false }
        );
    }


    render() {
        return (
            <View style={{flex: 1}}>
                <LoaderModal
                    loading={this.state.loading}/>
                <StatusBar translucent backgroundColor="rgba(0,0,0,0.4)"/>
                <Header
                    backgroundColor='#ad6cd9'
                    containerStyle={{
                        height: 80
                    }}
                    leftComponent={
                        <Ripple onPress={() => this.props.navigation.pop()}>
                            <Icon type='ionicon' name='arrow-back-outline' color='#fff'
                            /></Ripple>}
                    statusBarProps={{barStyle: 'light-content'}}
                    barStyle="light-content"
                    placement="center"
                    centerComponent={{text: 'Detail', style: {color: '#fff', fontWeight: 'bold'}}}
                />
                <ScrollView style={{flex: 1}}>
                    <View style={{backgroundColor: 'white', padding: 5,flex: 1,
                        alignItems:'center',
                        // justifyContent: 'flex-end',
                    }}>
                        <Button
                            onPress={() => this.tindakLanjuti()}
                            titleStyle={{fontSize:15}}
                            buttonStyle={{backgroundColor:'#b50000',height:50,borderRadius:5,width:200}}
                            // icon={
                            //     <Icon
                            //         name="phone"
                            //         size={15}
                            //         color="white"
                            //         type="font-awesome-5"
                            //     />
                            // }
                            iconRight
                            title="Tindak Lanjuti"
                        />
                    </View>
                    <ListItem
                        bottomDivider>
                        <ListItem.Content>
                            <ListItem.Title>{this.state.dataDetail.nama}</ListItem.Title>
                            <ListItem.Title>No Hp {this.state.dataDetail.no_hp}</ListItem.Title>
                            <ListItem.Subtitle style={{fontSize: 17}}>{this.state.dataDetail.kecamatan}</ListItem.Subtitle>
                            <ListItem.Subtitle style={{fontSize: 17}}>{this.state.dataDetail.lokasi}</ListItem.Subtitle>
                            <ListItem.Subtitle style={{fontSize: 17}}>{this.state.dataDetail.pesan}</ListItem.Subtitle>
                        </ListItem.Content>
                        {/*<ListItem.Chevron/>*/}
                    </ListItem>

                    <Image source={{uri: this.state.dataDetail.file}} style={{
                        width: Dimensions.get('screen').width,
                        height: 200
                    }}/>
                    {/*<MapView*/}
                    {/*    style={{width:Dimensions.get('screen').width,height:200}}*/}
                    {/*    initialRegion={{*/}
                    {/*        latitude: parseFloat(this.state.dataDetail.lat),*/}
                    {/*        longitude: parseFloat(this.state.dataDetail.lng),*/}
                    {/*        latitudeDelta: 0.000043,*/}
                    {/*        longitudeDelta: 0.000034,*/}
                    {/*    }}*/}
                    {/*/>*/}


                </ScrollView>
            </View>
        );
    }


}


const styles = StyleSheet.create({
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ffffff',
        textAlign: 'center',
    },
    button: {
        width: 300,
        backgroundColor: 'orange',
        borderRadius: 25,
        marginVertical: 2,
        paddingVertical: 13,
    },
    loader: {
        marginTop: 18,
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 63,
        borderWidth: 1,
        borderColor: 'white',
        marginBottom: 10,
        alignSelf: 'center',
        position: 'absolute',
        marginTop: 10,
    },
});
