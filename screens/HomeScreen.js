import { StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React from 'react'

const HomeScreen = () => {
  return (
    <View style = {styles.TabViewStyle}>
       <View style= {{flexDirection: 'column', justifyContent:'center', alignSelf:'center'}}>
        <Text style = {styles.TextStyle} >
         TVF Hakem Sistemi
        </Text>
        <Text style = {styles.text2Style}>
        Yönetici Paneli
        </Text>
       
       </View>
        <TouchableOpacity style ={styles.extButtonStyle}>
            <Text style = {styles.TextStyle}>
                Çıkış

            </Text>
        </TouchableOpacity>
      
    </View>
  )
}



export default HomeScreen

const styles = StyleSheet.create({
    TabViewStyle : {
        height: 'auto',
        backgroundColor: 'blue',
        padding:10,
        top: 70,
        borderRadius:50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        
    

    },
    TextStyle: {
        color: 'white',
        fontSize: 16,
        left: 10,
    },
    extButtonStyle: {
    right:30,
    alignSelf:'center'
    },
    text2Style : {
        color: 'white',
        fontSize: 12,
        left:10,
        margin:5



    }


    
        
    
})