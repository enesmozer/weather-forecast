import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getWeather } from './store/reducers/weather';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const dispatch = useDispatch();
  const { weather, loading } = useSelector((state) => state.weather);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        // setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);
  useEffect(() => {
    if (location) {
      dispatch(getWeather(location.coords.latitude, location.coords.longitude));
    }
  }, [location]);
  return (
    <View style={styles.container}>
      {location && (
        <>
          <Image
            source={{
              uri: weather?.current?.condition?.icon,
            }}
            style={styles.image}
          />
          <Text>{weather?.location?.name}</Text>
          <Text>{weather?.current?.temp_c}</Text>
          <Text>{weather?.current?.condition?.text}</Text>
        </>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 66,
    height: 58,
  },
});
