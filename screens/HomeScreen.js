import { StyleSheet, Text, TouchableOpacity, View, StatusBar, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { adminAPI, refereeApi } from '../api'; 
import { Alert } from 'react-native';
const DAYS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

const HomeScreen = ({navigation}) => {
    const today = new Date(); // güncel tarih
    const dateString = today.toLocaleDateString('tr-TR'); // Örn: 26.10.2025
    const timeString = today.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    }); 
      
    const [matches, setMatches] = useState([]);
    const [referees, setReferees] = useState([]);
    const [assigmentBtn, setAssigmentBtn] = useState(false);
    const [assigment, setAssigment] = useState(false);
    const [selectedDays, setSelectedDays] = useState([]); // Müsait olunmayan günler

    const [role, setRole] = useState(null);
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchUserInfoAndMatches = async () => {
        try {
          const res = await adminAPI.getMatches();
          setMatches(res.data);
          console.log(res.data)
          const referees = await refereeApi.getReferees();
          setReferees(referees.data);
          console.log(referees.data)

        } catch(err) {
          console.log('Maçlar alınırken hata oluştu:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchUserInfoAndMatches();
    }, []);
   const getImportanceLabel = (value) => {
  if (value >= 7) {
    return { label: "Yüksek", color: "#d32f2f" };
  }else if(value >= 4) {
    return { label: "Orta", color: "#f9a825" };
  }else{
    return { label: "Düşük", color: "#388e3c" };
  }
};
const refereeAssigment = async() => {
  const assigment = refereeApi.assignmentManuel()
  setAssigment(true);

};

const getMatches = async () =>{
  console.log("data çağırıldı")
 const res = await adminAPI.getMatches();
 setMatches(res.data);
 setAssigment(false);
}


useEffect(() => {
  getMatches();
}, [assigment]);

const renderMatch = ({ item }) => {
  item?.assignment === null ? setAssigmentBtn(true) : setAssigmentBtn(false)
  
  const importance = getImportanceLabel(item?.difficulty?.difficultyScore);
  return (
    <View style={styles.matchItem}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.matchTeams}>{item.homeTeam} - {item.awayTeam}</Text>
        {/* Önem etiketi: küçük, renkli, yazılı */}
        <View style={[styles.importanceBadge, { backgroundColor: importance.color + '22' }]}> 
          <Text style={[styles.importanceText, { color: importance.color }]}>
            {importance.label}
          </Text>
        </View>
      </View>
      <Text style={styles.matchDate}>Tarih: {item.matchDate}</Text>
      <Text style={styles.matchLocation}>Konum: {item.venue}</Text>
      <Text style={styles.matchAssignment}>
        {item.assignment ? item?.assignment?.refereeName : "Hakem Atanmadı"}
      </Text>
    </View>
  );
};


  const handleToggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmitUnavailableDays = async () => {
    try {
      await api.post(`/referees/${username}/unavailables`, { days: selectedDays });
      Alert.alert('Başarılı', 'Müsait olmadığınız günler kaydedildi!');
    } catch (err) {
      console.log('Müsait günler kaydedilemedi:', err);
      Alert.alert('Hata', 'Müsait olmadığınız günler kaydedilemedi!');
    }
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

        <TouchableOpacity style={styles.extButtonStyle} onPress={() => navigation.goBack()} >
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
        {
        assigmentBtn &&
        <View style={{alignSelf:'center', justifyContent:'center',}}>
        <TouchableOpacity
        style={styles.assignButtonMini}
        onPress={() => {
          refereeAssigment(),
          setAssigmentBtn(false)
        }}
        >
          <Text style={styles.assignBtnTextMini}>Hakem Ata</Text>
        </TouchableOpacity>
        </View>
        }

      {/* Hakeme özel müsait olmadığı günler seçimi */}
      {role === 'hakem' && (
        <View style={{margin: 16, backgroundColor: '#fff', borderRadius: 12, padding: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4 }}>
          <Text style={{fontWeight: 'bold', color: '#007AFF', fontSize: 16, marginBottom: 8}}>Müsait Olmadığım Günler</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
            {DAYS.map((day) => (
              <TouchableOpacity
                key={day}
                onPress={() => handleToggleDay(day)}
                style={{
                  backgroundColor: selectedDays.includes(day) ? '#d32f2f' : '#e6e6e6',
                  paddingHorizontal: 14,
                  paddingVertical: 7,
                  borderRadius: 16,
                  margin: 5,
                }}
              >
                <Text style={{ color: selectedDays.includes(day) ? 'white' : '#333', fontWeight: 'bold' }}>{day}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={handleSubmitUnavailableDays} style={{marginTop:14, alignSelf:'center', backgroundColor:'#007AFF', borderRadius:8, paddingHorizontal:20, paddingVertical:8}}>
            <Text style={{color:'white', fontWeight:'bold'}}>Günleri Kaydet</Text>
          </TouchableOpacity>
        </View>
      )}
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
  paddingVertical: 12,
  paddingHorizontal: 12,
  borderRadius: 6,
  alignSelf: 'flex-end',
  bottom: 20 
},
assignBtnTextMini: {
  color: 'white',
  fontWeight: 'bold',
  fontSize: 12,
  letterSpacing: 0.2,
},




})