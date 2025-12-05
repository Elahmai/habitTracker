// menu screen
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View, TextInput, FlatList } from "react-native";
import { auth } from "../app/firebase";
import * as Progress from 'react-native-progress';
import { Calendar } from 'react-native-calendars';

const Home = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    await signOut(auth);
    await AsyncStorage.removeItem("userToken");
    Alert.alert("Logged Out", "You’ve been signed out.");
    navigation.replace("Login");
  };

  const [darkMode, setDarkMode] = useState(false);
  const [streak, SetStreak] = useState(0);

  // Load streak from AsyncStorage
  useEffect(() => {
    const checkStreak = async () => {
      const today = new Date().toDateString();
      const lastLogin = await AsyncStorage.getItem('lastLogin');
      const currentStreak = await AsyncStorage.getItem('streak');
      
      if (lastLogin !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastLogin && new Date(lastLogin).toDateString() === yesterday.toDateString()) {
          const newStreak = parseInt(currentStreak || '0') + 1;
          SetStreak(newStreak);
          await AsyncStorage.setItem('streak', newStreak.toString());
        } else {
          SetStreak(1);
          await AsyncStorage.setItem('streak', '1');
        }
        await AsyncStorage.setItem('lastLogin', today);
      } else {
        SetStreak(parseInt(currentStreak || '1'));
      }
    };
    checkStreak();
  }, []);

  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');

  // Load habits from AsyncStorage
  useEffect(() => {
    const loadHabits = async () => {
      const savedHabits = await AsyncStorage.getItem('habits');
      if (savedHabits) setHabits(JSON.parse(savedHabits));
    };
    loadHabits();
  }, []);

  // Add new habit
  const addHabit = () => {
    if (newHabit.trim() === '') return;
    const newItem = { id: Date.now(), name: newHabit.trim(), done: false };
    const updatedHabits = [...habits, newItem];
    setHabits(updatedHabits);
    setNewHabit('');
    AsyncStorage.setItem('habits', JSON.stringify(updatedHabits));
  };

  // Toggle habit completion
  const toggleHabit = (id) => {
    const updatedHabits = habits.map(habit =>
      habit.id === id ? { ...habit, done: !habit.done } : habit
    );
    setHabits(updatedHabits);
    AsyncStorage.setItem('habits', JSON.stringify(updatedHabits));
  };

  const completed = habits.filter(h => h.done).length;
  const progress = habits.length > 0 ? completed / habits.length : 0;

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#111' : '#fffce8' }]}>
      
      {/* Top Section */}
      <View style={styles.topSection}>
        <Text style={[styles.title, { color: darkMode ? '#fff' : '#333' }]}>
          Tracking Habits Daily🏡
        </Text>

        <TouchableOpacity
          onPress={() => setDarkMode(!darkMode)}
          style={[styles.toggleButton, { backgroundColor: darkMode ? '#3a3939ff' : '#cef6f0ff' }]}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>
            Switch to {darkMode ? 'Light' : 'Dark'}
          </Text>
          <Text style={styles.streak}>🔥 Streak: {streak} days</Text>
        </TouchableOpacity>
      </View>

      {/* Middle Section */}
      <View style={styles.middleSection}>
        <Text style={styles.prog}>DAILY PROGRESS</Text>
        <Progress.Circle
          size={150}
          progress={progress}
          animated={true}
          showsText={true}
          formatText={() => `${Math.round(progress * 100)}%`}
          color='#00bfa6'
          thickness={8}
          unfilledColor='#eee'
          borderWidth={0}
          style={{ marginBottom: 20 }}
        />

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Add new Habit"
            value={newHabit}
            onChangeText={setNewHabit}
          />
          <TouchableOpacity onPress={addHabit} style={styles.addBtn}>
            <Text style={{ color: 'white' }}>Add</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={habits}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.habitItem} onPress={() => toggleHabit(item.id)}>
              <View style={[styles.checkbox, item.done && styles.checked]} />
              <Text style={[styles.habitText, item.done && styles.doneText]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <Calendar
          style={{ width: '100%' }}
          theme={{
            backgroundColor: darkMode ? '#111' : '#fffce8',
            calendarBackground: darkMode ? '#111' : '#fffce8',
            textSectionTitleColor: darkMode ? '#fff' : '#333',
            dayTextColor: darkMode ? '#fff' : '#333',
            todayTextColor: '#00bfa6',
          }}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    paddingTop: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  middleSection: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  bottomSection: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
  },
  streak: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6f01ff'
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  addBtn: {
    backgroundColor: '#00bfa6',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 5,
    borderRadius: 8,
    backgroundColor: '#f3f3f3'
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#999',
    marginRight: 15,
    backgroundColor: 'white',
  },
  checked: {
    backgroundColor: '#00bfa6',
    borderColor: '#00bfa6'
  },
  habitText: {
    fontSize: 16,
    color: '#999'
  },
  doneText: {
    textDecorationLine: 'line-through',
    color: '#999'
  },
  button: {
    backgroundColor: "#ec7b7bd6",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  toggleButton: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  prog: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  }
});
