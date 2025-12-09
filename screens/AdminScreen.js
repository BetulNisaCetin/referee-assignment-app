import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";
import { adminAPI } from "../api";

export default function AdminScreen() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");

  const [matches, setMatches] = useState([]);

  const loadMatches = async () => {
    try {
      const res = await adminAPI.getMatches();
      setMatches(res.data.matches);
    } catch (err) {
      console.log("Load matches error:", err);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  const createMatch = async () => {
    if (!date || !time || !location || !teamA || !teamB) {
      alert("Lütfen tüm maç bilgilerini doldurun.");
     return; // Eksik veri varsa işlemi durdur
    }
    try {
      const newMatch = {
        date,
        time,
        location,
        teamA,
        teamB
      };

      const res = await adminAPI.createMatch(newMatch);
      console.log("Match created:", res.data);

      setDate("");
      setTime("");
      setLocation("");
      setTeamA("");
      setTeamB("");

      loadMatches();

    } catch (err) {
      console.log("add match error:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Maç Oluştur</Text>

      <TextInput
        style={styles.input}
        placeholder="Tarih (2025-12-10)"
        value={date}
        onChangeText={setDate}
      />

      <TextInput
        style={styles.input}
        placeholder="Saat (14:00)"
        value={time}
        onChangeText={setTime}
      />

      <TextInput
        style={styles.input}
        placeholder="Konum"
        value={location}
        onChangeText={setLocation}
      />

      <TextInput
        style={styles.input}
        placeholder="Takım A"
        value={teamA}
        onChangeText={setTeamA}
      />

      <TextInput
        style={styles.input}
        placeholder="Takım B"
        value={teamB}
        onChangeText={setTeamB}
      />

      <Button title="Maçı Ekle" onPress={createMatch} />

      <Text style={styles.listTitle}>Mevcut Maçlar</Text>
      <FlatList
        data={matches}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.matchItem}>
            <Text style={styles.matchText}>Tarih: {item.date}</Text>
            <Text style={styles.matchText}>Saat: {item.time}</Text>
            <Text style={styles.matchText}>Konum: {item.location}</Text>
            <Text style={styles.matchText}>{item.teamA} vs {item.teamB}</Text>

            <Text style={{ color: item.assignedReferee ? "green" : "red" }}>
              Durum: {item.status}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  listTitle: { marginTop: 20, fontSize: 20, fontWeight: "bold" },
  matchItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginTop: 10,
  },
  matchText: { fontSize: 16 },
});
