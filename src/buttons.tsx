import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { Component, useState } from 'react'
import { TextInput } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native';

const camimg = require('../src/assets/refresh.png');

const Buttons = () => {
    const button1 = () => {
        console.log("button1");
    };
    const button2 = () => {
        console.log("button2");
    };
    const navigation = useNavigation()
    return (
        <View style={styles.container}>
            <Text style={styles.texts}>Can be styled</Text>
            {/* <TouchableOpacity onPress={button1} style={{ alignItems: 'center',marginBottom:30,borderRadius:5,backgroundColor: 'yellow',borderWidth: 1,
}}> */}
    <TouchableOpacity onPress={button1}>
                <Text style={styles.buttonText}>   Button1  </Text>
            </TouchableOpacity>
            <Text style={styles.texts}>cannot be styled</Text>
            <Button title='Accept' onPress={button2} />
            <Text style={styles.texts}>Image Button</Text>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Aboutus' as never)}>
                <Image source={camimg} style={styles.imgstyle} />
            </TouchableOpacity>

        </View>
    )

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:'center'
    },
    buttonText: {
            borderWidth: 1,
            borderRadius: 5,
            borderColor: 'blue',
            alignSelf: 'center',
            backgroundColor: 'yellow',
            fontSize: 20,
            color: 'black'
    },
    texts: {
        marginLeft: 20,
        color: 'black',
        marginTop:10,
        marginBottom:10,
    },
    imgstyle: {
        width: 30,
        height: 30,
    },
    menuItem: {
        marginTop: 30,
        alignSelf:'center'

    },
})

export default Buttons