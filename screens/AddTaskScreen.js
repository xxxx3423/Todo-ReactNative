import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const AddTaskScreen = ({ navigation }) => {
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskCategory, setTaskCategory] = useState('');

    const handleAddTask = () => {
        if (!taskName.trim()) {
            Alert.alert('Ошибка', 'Название задачи обязательно');
            return;
        }

        // Создаем объект новой задачи
        const newTask = {
            id: Math.random().toString(),
            name: taskName.trim(),
            description: taskDescription.trim(),
            category: taskCategory.trim(),
        };

        // ПРАВИЛЬНЫЙ СПОСОБ: Передаем задачу назад как параметр навигации
        // Убедись, что 'TaskList' — это точное название твоего первого экрана в Stack.Navigator
        navigation.navigate('TaskList', { newTask }); 
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Додати задачу</Text>

            <TextInput
                style={styles.input}
                placeholder="Назва задачі"
                value={taskName}
                onChangeText={setTaskName}
            />

            <TextInput
                style={styles.input}
                placeholder="Опис"
                value={taskDescription}
                onChangeText={setTaskDescription}
            />

            <TextInput
                style={styles.input}
                placeholder="Категорія"
                value={taskCategory}
                onChangeText={setTaskCategory}
            />

            <Button title="Додати задачу" onPress={handleAddTask} />

            <View style={{ marginTop: 10 }}>
                <Button
                    title="Назад"
                    onPress={() => navigation.goBack()}
                    color="#808080"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24, // Больше отступов для «дыхания» интерфейса
        backgroundColor: '#F8FAFC', // Светлый серо-голубой фон (выглядит чище)
    },
    title: {
        fontSize: 28, // Увеличили размер
        fontWeight: '800', // Более жирный шрифт для акцента
        marginBottom: 24,
        color: '#1E293B', // Глубокий темно-синий вместо черного
        letterSpacing: -0.5, // Небольшое сужение для премиального вида
    },
    input: {
        height: 56, // Увеличили высоту для удобства нажатия пальцем
        backgroundColor: '#FFFFFF',
        borderRadius: 16, // Сильное скругление — тренд современного дизайна
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#334155',
        borderWidth: 1,
        borderColor: '#E2E8F0', // Очень мягкая граница
        // Тень для iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        // Тень для Android
        elevation: 2,
        marginBottom: 20,
    },
});

export default AddTaskScreen; //export add task screen
