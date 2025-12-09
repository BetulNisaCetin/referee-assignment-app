import { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, StatusBar, ActivityIndicator, Alert, ScrollView, FlatList } from 'react-native'
import { Calendar } from 'react-native-calendars';
import { userAPI, assignmentAPI, availabilityAPI } from '../api';

const HomeScreen = ({navigation}) => {
    const [userInfo, setUserInfo] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unavailableDates, setUnavailableDates] = useState({});

    const today = new Date();
    const dateString = today.toLocaleDateString('tr-TR');
    const timeString = today.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    });

    useEffect(() => {
      fetchUserData();
      fetchAssignments();
      fetchAvailability();
    }, []);

    const fetchAvailability = async () => {
      try {
        const res = await availabilityAPI.getAvailability();
        if (res.data.unavailableDates && res.data.unavailableDates.length > 0) {
          const dates = {};
          res.data.unavailableDates.forEach(date => {
            dates[date] = { selected: true, marked: true, selectedColor: '#FF6B6B' };
          });
          setUnavailableDates(dates);
        }
      } catch (err) {
        console.error('Availability yüklenirken hata:', err);
      }
    };

    const fetchUserData = async () => {
      try {
        const res = await userAPI.getProfile();
        setUserInfo(res.data);
      } catch (err) {
        console.error('Profil yüklenirken hata:', err);
        Alert.alert('Hata', 'Profil bilgileri yüklenemedi.');
      } finally {
        setLoading(false);
      }
    };

    const fetchAssignments = async () => {
      try {
        const res = await assignmentAPI.getAssignments();
        setAssignments(res.data);
      } catch (err) {
        console.error('Görevler yüklenirken hata:', err);
      }
    };

    // Müsait olmadığı günleri takvime işaretle (mock data örneği)
    const generateUnavailableDates = () => {
      const dates = {};
      // Örnek: Bugünden başlayarak 10 gün içinde bazı günleri işaretle
      for (let i = 1; i <= 10; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        dates[dateStr] = { selected: true, marked: true, selectedColor: '#FF6B6B' };
      }
      return dates;
    };

    useEffect(() => {
      if (userInfo?.userType === 'Hakem') {
        setUnavailableDates(generateUnavailableDates());
      }
    }, [userInfo]);

    const handleDateSelect = (day) => {
      const dateStr = day.dateString;
      setUnavailableDates(prev => {
        const updated = { ...prev };
        if (updated[dateStr]) {
          delete updated[dateStr];
        } else {
          updated[dateStr] = { selected: true, marked: true, selectedColor: '#FF6B6B' };
        }
        
        // Seçilen günleri diziye çevir ve backend'e gönder
        const selectedDates = Object.keys(updated).filter(key => updated[key].selected);
        saveAvailability(selectedDates);
        
        return updated;
      });
    };

    const saveAvailability = async (dates) => {
      try {
        await availabilityAPI.saveAvailability(dates);
        console.log('Müsait olmadığı günler kaydedildi:', dates);
        Alert.alert('Başarılı', 'Müsait olmadığı günler kaydedildi');
      } catch (err) {
        console.error('Availability kaydetme hatası:', err);
        Alert.alert('Hata', 'Günler kaydedilirken hata oluştu');
      }
    };

    const renderMatchItem = ({ item }) => (
      <View style={styles.matchCard}>
        <Text style={styles.matchTitle}>{item.title}</Text>
        <Text style={styles.matchDetail}>📍 {item.location}</Text>
        <Text style={styles.matchDetail}>📅 {item.date}</Text>
        <Text style={[styles.matchDetail, { color: item.status === 'Confirmed' ? '#4CAF50' : '#FFC107' }]}>
          Status: {item.status}
        </Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <StatusBar />
      <ScrollView showsVerticalScrollIndicator={false}>
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
          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            <>
              <Text style ={styles.infoTextStyle}>Yönetici Paneli</Text>
              <Text style ={styles.userTextStyle}>{userInfo?.name || 'Kullanıcı'} - {userInfo?.userType || 'Hakem'}</Text>
              <Text style={styles.dateTextStyle}>{dateString}</Text>
              <Text style={styles.dateTextStyle}>{timeString}</Text>
              <Text style={{ marginTop: 16, fontSize: 14, color: '#666' }}>
                Görev Sayısı: {assignments.length}
              </Text>
            </>
          )}
        </View>

        {/* Hakem ise takvim göster */}
        {!loading && userInfo?.userType === 'Hakem' && (
          <View style={styles.calendarSection}>
            <Text style={styles.sectionTitle}>📅 Müsait Olmadığım Günler</Text>
            <Calendar
              markedDates={unavailableDates}
              onDayPress={handleDateSelect}
              theme={{
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                textSectionTitleColor: '#b6c1cd',
                selectedDayBackgroundColor: '#007AFF',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#007AFF',
                dayTextColor: '#2d3436',
                textDisabledColor: '#d9e1e8',
                dotColor: '#007AFF',
                selectedDotColor: '#ffffff',
                arrowColor: '#007AFF',
              }}
            />
          </View>
        )}

        {/* Maç Listesi */}
        {!loading && assignments.length > 0 && (
          <View style={styles.matchesSection}>
            <Text style={styles.sectionTitle}>⚽ Görevli Olduğum Maçlar</Text>
            <FlatList
              data={assignments}
              renderItem={renderMatchItem}
              keyExtractor={(item) => item._id}
              scrollEnabled={false}
            />
          </View>
        )}

        {!loading && assignments.length === 0 && (
          <View style={styles.emptySection}>
            <Text style={styles.emptyText}>Henüz görev atanmadı</Text>
          </View>
        )}
      </ScrollView>
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
    marginTop: 50,
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
  calendarSection: {
    backgroundColor: 'white',
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  matchesSection: {
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  matchCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  matchTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  matchDetail: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  emptySection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});