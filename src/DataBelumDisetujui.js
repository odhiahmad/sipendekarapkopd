import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Image,
    Modal,
    ScrollView,
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
export default class DataBelumDisetujui extends Component {
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
            id_kab: '',
            user_token: '',
            token: '',
            id_user: '',
            index: '',
        };


    }

    componentDidMount() {
        this.getIndex();
    }


    async getIndex() {
        const id_kab = await AsyncStorage.getItem('id_kab');
        const token = await AsyncStorage.getItem('token');
        const tes = jwt_decode(token)
        console.log(tes)

        this.setState({
            id_kab: tes.id_kab,
            user_token: token,
            id_user: tes.id_user,
            loading: true,
            showTryAgain: false,
            token: tes.token
        });
        return fetch(baseApi + 'kebakaran?id_kab=' + id_kab + '&status=0').then((response) => response.json()).then((responseJson) => {
            this.setState({
                loading: false,
                data: responseJson.result,
                showTryAgain: false,
            });

            console.log(responseJson.result)


        }).catch((error) => {
            console.log(error);
            this.setState({
                loading: false,
                showTryAgain: true,
            });
        });
    }

    setModalUnvisible(visible) {
        this.setState({modalVisible: visible, dataDetail: []});
    }

    setModalVisible(visible, item, index) {

        this.setState({
            index: index,
            dataDetail: item,
            modalVisible: visible,
        });


    }

    renderRow = ({item, index}) => {
        const {navigate} = this.props.navigation;
        return (
            <ListItem
                onPress={() =>
                   navigate('DataBelumDisetujuiDetail',{'dataItem':item})
                }

                key={index} bottomDivider>
                <Avatar rounded={true} avatarStyle={{width: 80, height: 80}} source={{uri: item.file}}/>
                <ListItem.Content>
                    <ListItem.Title>{item.nama.toUpperCase()}</ListItem.Title>
                    <ListItem.Title>{item.no_hp}</ListItem.Title>
                    <ListItem.Subtitle style={{fontSize: 17}}>{item.kecamatan}</ListItem.Subtitle>
                    <ListItem.Subtitle style={{fontSize: 17}}>{item.lokasi}</ListItem.Subtitle>
                    <ListItem.Subtitle
                        style={{fontSize: 17}}>{moment(item.created_at).startOf('day').fromNow()}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron/>
            </ListItem>
        );
    };


    handleLoadMore = () => {

        if (this.state.searchAktif === 0) {
            this.setState(
                {page: this.state.page + 1, isLoading: true},
                this.getData,
            );
        }

    };

    renderFooter = () => {
        return (
            this.state.isLoading ?
                <View style={styles.loader}>
                    <ActivityIndicator size="large"/>
                </View> : null
        );
    };

    yaLanjut = () => {
        this.setState({
            loading: true,
        })

        console.log({
            pelaporan_id: this.state.dataDetail.id,
            id_user: this.state.id_user,
            user_token: this.state.token,
            status: 1
        })
        return fetch(baseApi + 'verifikasi', {
            method: 'PUT',
            headers: {
                Accept: '*/*',
                'Content-Type': 'application/x-www-form-urlencoded',
                // 'Authorization': 'Bearer ' + this.state.user_token,
            },
            body: {
                pelaporan_id: this.state.dataDetail.id,
                id_user: this.state.id_user,
                user_token: this.state.token,
                status: 1
            }
        }).then((response) => response.json())
            .then((json) => {
                this.setState({
                    loading: false,
                })
                this.state.data.splice(this.state.index, 1);
                this.setModalUnvisible(!this.state.modalVisible)
                Alert.alert(
                    "Notifikasi",
                    "Berhasil memverifikasi",
                    [
                        {text: "OK", onPress: () => console.log("OK Pressed")}
                    ],
                    {cancelable: false}
                );
            }).catch((error) => {
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
                {text: "Ya", onPress: () => this.yaLanjut()}
            ],
            {cancelable: false}
        );
    }
    // _onChangeSearchText(text) {
    //
    //
    //     if (text === '') {
    //         this.setState({
    //             searchAktif: 0,
    //         });
    //     } else {
    //         this.setState(
    //             {page: 1, searchAktif: 1, isLoading: false, searchText: text},
    //             this.searchData,
    //         );
    //     }
    //
    // }

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
                    centerComponent={{text: 'Data Belum Di Tindak Lanjuti', style: {color: '#fff', fontWeight: 'bold'}}}
                />
                {/*<SearchBar*/}
                {/*    placeholder="Type Here..."*/}
                {/*    onChangeText={this._onChangeSearchText.bind(this)}*/}
                {/*    value={search}*/}
                {/*/>*/}
                {this.state.showTryAgain === true ?
                    <View style={styles.container}>
                        <Text style={{color: 'gray'}}>Koneksi Bermasalah :(</Text>
                        <TouchableOpacity style={{
                            width: 200,
                            backgroundColor: 'red',
                            borderRadius: 25,
                            marginVertical: 2,
                            paddingVertical: 13,
                        }} onPress={() => this.getIndex()}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '500',
                                color: '#ffffff',
                                textAlign: 'center',
                            }}>Refresh </Text>
                        </TouchableOpacity></View> : <FlatList
                        onEndReached={this.handleLoadMore}
                        onEndReachedThreshold={0.1}
                        ListFooterComponent={this.renderFooter}
                        renderItem={this.renderRow}
                        keyExtractor={(item, index) => index.toString()}
                        data={this.state.data}/>}
                <Modal
                    onHardwareBackPress={() => this.setModalUnvisible(!this.state.modalVisible)}
                    propagateSwipe={true}
                    modalTitle="Tes"
                    animationInTiming="300"
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setModalUnvisible(!this.state.modalVisible);
                    }}>
                    <Header
                        containerStyle={{height: 60}}
                        backgroundColor='#e52d27'
                        rightComponent={
                            <Ripple onPress={() => this.setModalUnvisible(!this.state.modalVisible)}>
                                <Icon type='font-awesome-5' size={25} name='times-circle' color='#fff'
                                /></Ripple>}

                        placement="center"
                        centerComponent={
                            {text: 'Detail', style: {fontSize: 18, color: '#fff'}}
                        }
                    />

                    {this.state.showTryAgain === true ? <View></View> :
                        <ScrollView style={{flex: 1}}>
                            <View style={{
                                backgroundColor: 'white', padding: 5, flex: 1,
                                alignItems: 'center',
                                // justifyContent: 'flex-end',
                                marginTop: 5,
                                marginBottom: 5
                            }}>
                                <Button
                                    onPress={() => this.tindakLanjuti()}
                                    titleStyle={{fontSize: 15}}
                                    buttonStyle={{backgroundColor: '#b50000', height: 40, borderRadius: 10, width: 200}}
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
                                    <ListItem.Subtitle
                                        style={{fontSize: 17}}>{this.state.dataDetail.kecamatan}</ListItem.Subtitle>
                                    <ListItem.Subtitle
                                        style={{fontSize: 17}}>{this.state.dataDetail.lokasi}</ListItem.Subtitle>
                                    <ListItem.Subtitle
                                        style={{fontSize: 17}}>{this.state.dataDetail.pesan}</ListItem.Subtitle>
                                </ListItem.Content>
                                {/*<ListItem.Chevron/>*/}
                            </ListItem>

                            <Image source={{uri: this.state.dataDetail.file}} style={{
                                width: Dimensions.get('screen').width,
                                height: 200,
                                marginTop: 5,
                                margin: 10,
                                marginBottom: 5
                            }}/>
                            <MapView
                                style={{width: Dimensions.get('screen').width, height: 200}}
                                initialRegion={{
                                    latitude: parseFloat(this.state.dataDetail.lat),
                                    longitude: parseFloat(this.state.dataDetail.lng),
                                    latitudeDelta: 0.000043,
                                    longitudeDelta: 0.000034,
                                }}
                            />


                        </ScrollView>
                    }

                </Modal>
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
