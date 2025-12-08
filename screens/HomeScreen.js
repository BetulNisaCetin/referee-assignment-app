import { StyleSheet, Text, TouchableOpacity, View, StatusBar,FlatList } from 'react-native'

const HomeScreen = ({navigation}) => {
    const today = new Date(); // güncel tarih
    const dateString = today.toLocaleDateString('tr-TR'); // Örn: 26.10.2025
    const timeString = today.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    }); 
      
    const matches = [
      {
        id: "1",
        home: "Fenerbahçe",
        away: "Eczacıbaşı",
        date: "12.12.2025",
        location: "Ankara Spor Salonu",
        assigned: false,
        importance: 1,
      },
      {
        id: "2",
        home: "VakıfBank",
        away: "Galatasaray",
        date: "13.12.2025",
        location: "İstanbul Burhan Felek",
        assigned: true,
        importance: 3,
      },
      {
        id: "3",
        home: "Karayolları",
        away: "PTT",
        date: "14.12.2025",
        location: "Başkent Voleybol Salonu",
        assigned: false,
        importance: 2,
      },
    ];
   const getImportanceLabel = (value) => {
  if (value === 1) return { label: "Yüksek", color: "#d32f2f" };
  if (value === 2) return { label: "Orta", color: "#f9a825" };
  return { label: "Düşük", color: "#388e3c" };
};

const renderMatch = ({ item }) => {
  const importance = getImportanceLabel(item.importance);
  return (
    <View style={styles.matchItem}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.matchTeams}>{item.home} - {item.away}</Text>
        {/* Önem etiketi: küçük, renkli, yazılı */}
        <View style={[styles.importanceBadge, { backgroundColor: importance.color + '22' }]}> 
          <Text style={[styles.importanceText, { color: importance.color }]}>
            {importance.label}
          </Text>
        </View>
      </View>
      <Text style={styles.matchDate}>Tarih: {item.date}</Text>
      <Text style={styles.matchLocation}>Konum: {item.location}</Text>
      <Text style={styles.matchAssignment}>
        {item.assigned ? "Hakem Atandı" : "Hakem Atanmadı"}
      </Text>
      <TouchableOpacity
        style={styles.assignButtonMini}
        onPress={() => {
          alert(`${item.home} - ${item.away} için hakem ata işlemi!`)
        }}
      >
        <Text style={styles.assignBtnTextMini}>Hakem Ata</Text>
      </TouchableOpacity>
    </View>
  );
};


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
      <View style={styles.container1}>

          <TouchableOpacity 
            style={styles.boxStyles}
            onPress={() => {}}
          >
            <Text style={styles.boxTextStyles}>Atama Bekleyen</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.boxStyles}
            onPress={() => {}}
          >
            <Text style={styles.boxTextStyles}>Aktif Hakem</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.boxStyles}
            onPress={() => {}}
          >
            <Text style={styles.boxTextStyles}>Bu Hafta Maç</Text>
          </TouchableOpacity>

      </View>

         {/* 📌 FLATLIST — Atama Bekleyen Maçlar */}
      <Text style={styles.listTitle}>Atama Bekleyen Maçlar</Text>

      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        renderItem={renderMatch}
        style={{ marginHorizontal: 20, marginBottom: 30 }}
      />
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
  },
  container1:{
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
    padding:20,
    marginTop:10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    

  },
  boxStyles:{
    width:110,
    height:110,
    backgroundColor:'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  boxTextStyles:{
    color:"#007AFF",
    fontSize:15,
  },
  listTitle: {
  fontSize: 18,
  fontWeight: '700',
  marginLeft: 20,
  marginTop: 10,
  marginBottom: 10,
  color: "#007AFF"
},

matchItem: {
  backgroundColor: "white",
  padding: 15,
  marginBottom: 10,
  borderRadius: 12,
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
  elevation: 3,
},

matchTeams: {
  fontSize: 16,
  fontWeight: "600",
  color: "#333",
},

matchDate: {
  fontSize: 14,
  color: "#007AFF",
  marginTop: 5,
},

assignButton: {
  backgroundColor: '#007AFF',
  alignItems: 'center',
  padding: 8,
  borderRadius: 8,
  marginTop: 8,
},
assignBtnText: {
  color: 'white',
  fontWeight: 'bold',
},
matchLocation: {
  fontSize: 13,
  color: '#555',
  marginTop: 3,
},
matchAssignment: {
  fontSize: 13,
  color: '#C30000',
  marginTop: 3,
  fontWeight: '500',
},
importanceBadge: {
  borderRadius: 8,
  paddingHorizontal: 7,
  paddingVertical: 1,
  alignSelf: 'flex-start',
  marginLeft: 10,
},
importanceText: {
  fontSize: 11,
  fontWeight: 'bold',
},
assignButtonMini: {
  backgroundColor: '#007AFF',
  alignItems: 'center',
  paddingVertical: 4,
  paddingHorizontal: 12,
  borderRadius: 6,
  marginTop: 5,
  alignSelf: 'flex-end',
},
assignBtnTextMini: {
  color: 'white',
  fontWeight: 'bold',
  fontSize: 12,
  letterSpacing: 0.2,
},




})