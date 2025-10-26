import { StyleSheet, Text, TouchableOpacity, View, StatusBar } from 'react-native'

const HomeScreen = ({navigation}) => {
    const today = new Date(); // güncel tarih
    const dateString = today.toLocaleDateString('tr-TR'); // Örn: 26.10.2025
    const timeString = today.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    }); 


  return (
    <View style={styles.container}>
      <StatusBar />
      <View style={styles.TabViewStyle}>
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignSelf: 'center' }}>
          <Text style={styles.TextStyle}>
            TVF Hakem Sistemi
          </Text>
          <Text style={styles.text2Style}>
            Yönetici Paneli
          </Text>
        </View>

        <TouchableOpacity style={styles.extButtonStyle} 
         onPress={() => navigation.goBack()}  >
        <Text style={styles.TextStyle}>Çıkış</Text>
        </TouchableOpacity>
        </View>
        <View style ={styles.infoView}>
        <Text style ={styles.infoTextStyle}>Yönetici Paneli</Text>
        <Text style ={styles.userTextStyle}>Betül Çetin-MHGK Üyesi</Text>
        <Text style={styles.dateTextStyle}>{dateString}</Text>
        <Text style={styles.dateTextStyle}>{timeString}</Text>


     </View>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#f4f4f4',
  },
  TabViewStyle: {
    backgroundColor: "#007AFF",
    padding: 10,
    marginTop: 50, // 🔹 Status bar alanını doldurur, mavi alan yukarı birleşir
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  TextStyle: {
    color: 'white',
    fontSize: 16,
    left: 10,
    fontWeight:'bold'
  },
  text2Style: {
    color: 'white',
    fontSize: 12,
    left: 10,
    margin: 5,
  },
  extButtonStyle: {
    right: 30,
    alignSelf: 'center',
    
    
    
  },
  infoView:{
    backgroundColor: 'white',
    height:'auto',
    width:'auto',
    marginTop:20,
    borderRadius:20,
    //marginRight:20,
    //marginLeft:20,
    marginHorizontal:20,
    paddingLeft:20,
    paddingVertical:20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
},
  infoTextStyle:{
    color:'black',
    fontSize:20,
    fontWeight:600


  },
  userTextStyle:{
    color:'grey',
   
    marginTop:5,
},
  dateTextStyle:{
    color:"#007AFF",
    marginTop:4,
    fontWeight:600


 }


})