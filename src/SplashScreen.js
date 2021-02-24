import React, { useState, useEffect } from 'react';
import { ActivityIndicator,View, Image,Text } from 'react-native';

import imagename from '../assets/logo-sipendekar.png'
import AsyncStorage from '@react-native-async-storage/async-storage';


const SplashScreen = props => {
  let [animating, setAnimating] = useState(true);

  useEffect(() => {

    setTimeout(() => {

      setAnimating(false);
      AsyncStorage.getItem('token').then(value =>
          props.navigation.navigate(
              value === null ? 'Auth' : 'Home'
          )
      );
    }, 5000);
  }, []);

  return (
      <View style={styles.viewStyles}>
        <View style={styles.logoAbon}>
          <Image source={imagename}
                 style={{ width: 160, height: 160, alignItems:'center' }}/>
        </View>
        <View style={styles.bottomView}>
          <ActivityIndicator
              animating={animating}
              color='red'
              size="large"
              style={styles.activityIndicator}/>
          <Text style={ styles.text }>1.0</Text>
        </View>
      </View>
  );
}

const styles = {
  viewStyles: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomView: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', //Here is the trick
    bottom: 2, //Here is the trick
  },
  backgroundImage: {
    width:'100%', height:'100%',
    flex: 1,justifyContent: 'center',
    resizeMode: 'stretch', // or 'stretch'
  },
  logoAbon: {
    position: 'absolute',
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  text: {
    fontSize: 10,
    color:'black'
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  }
}

export default SplashScreen;
