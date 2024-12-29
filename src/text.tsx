import { StyleSheet, Text, View } from 'react-native'
import React, { Component, useState } from 'react'
import { TextInput } from 'react-native-gesture-handler'

const Texts = () => {

  const [name,setName] = useState<any>(null);
  const [inputValue, setInputValue] = useState("");

  const handleChange = (text:any) => {
      // Allow only numbers
      const numericValue = text.replace(/[^0-9]/g, "");
      setInputValue(numericValue);
  };

    return (
      <View style={styles.container}>
        <Text style={styles.texts}>text</Text>
        <TextInput
          onChangeText={(text) => setName(text)}
          style={styles.textInput}
          placeholder="Full Name"
          placeholderTextColor='black'
        />
                <Text style={styles.texts}>text number</Text>
        <TextInput
                style={styles.textInput}
                onChangeText={handleChange}
                value={inputValue}
                keyboardType="numeric"
                placeholder="Enter numbers only"
                placeholderTextColor="#999"
            />

      </View>
    )
  
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
  },
  textInput: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 20,
    backgroundColor: 'white',
    color: 'black',
  },
  texts:{
    marginLeft: 20,
    color: 'black',
  }
})

export default Texts