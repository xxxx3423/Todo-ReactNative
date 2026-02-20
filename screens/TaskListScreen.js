import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Modal,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_STORAGE_KEY = 'tasks';

const TaskListScreen = ({ navigation, route }) => {
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [editedTask, setEditedTask] = useState(null);

    // Завантаження при старті
    useEffect(() => { loadTasks(); }, []);
    
    // Збереження при зміні списку
    useEffect(() => { saveTasks(); }, [tasks]);

    // Обробка нової задачі з екрана AddTask
    useEffect(() => {
        if (route.params?.newTask) {
            const newTask = route.params.newTask;
            setTasks((prevTasks) => [...prevTasks, newTask]);
            navigation.setParams({ newTask: undefined });
        }
    }, [route.params?.newTask]);

    const loadTasks = async () => {
        try {
            const storedTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
            if (storedTasks !== null) setTasks(JSON.parse(storedTasks));
        } catch (error) { 
            console.error('Помилка завантаження:', error); 
        }
    };

    const saveTasks = async () => {
        try {
            await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
        } catch (error) { 
            console.error('Помилка збереження:', error); 
        }
    };

    const handleDeleteTask = (taskId) => {
        setTasks(tasks.filter((task) => task.id !== taskId));
    };

    const handleEditTask = (taskId) => {
        const taskToEdit = tasks.find((task) => task.id === taskId);
        setEditingTask(taskId);
        setEditedTask({ ...taskToEdit });
    };

    const handleSaveTask = () => {
        if (!editedTask?.name) {
            Alert.alert('Помилка', 'Будь ласка, введіть назву завдання');
            return;
        }
        const updatedTasks = tasks.map((task) =>
            task.id === editingTask ? { ...editedTask } : task
        );
        setTasks(updatedTasks);
        setEditingTask(null);
        setEditedTask(null);
    };

    const renderItem = ({ item }) => (
        <View style={styles.taskItem}>
            <View style={styles.taskInfo}>
                <Text style={styles.taskName}>{item.name}</Text>
                {item.description ? <Text style={styles.taskDescription}>{item.description}</Text> : null}
                <Text style={styles.taskCategory}>{item.category || 'Без категорії'}</Text>
            </View>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEditTask(item.id)}>
                    <Ionicons name="create" size={22} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteTask(item.id)}>
                    <Ionicons name="trash" size={22} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 100 }}
                style={styles.flatList}
            />

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddTask')}
            >
                <Ionicons name="add" size={36} color="white" />
            </TouchableOpacity>

            <Modal
                visible={editingTask !== null}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setEditingTask(null)}
            >
                <TouchableOpacity 
                    style={styles.editTaskModal} 
                    activeOpacity={1} 
                    onPress={() => setEditingTask(null)}
                >
                    <View style={styles.editTaskContainer}>
                        <Text style={styles.editTaskTitle}>Редагування</Text>
                        
                        <TextInput
                            style={styles.editTaskInput}
                            placeholder="Назва завдання *"
                            placeholderTextColor="#64748B"
                            value={editedTask?.name}
                            onChangeText={(text) => setEditedTask({ ...editedTask, name: text })}
                        />
                        <TextInput
                            style={styles.editTaskInput}
                            placeholder="Опис"
                            placeholderTextColor="#64748B"
                            value={editedTask?.description}
                            onChangeText={(text) => setEditedTask({ ...editedTask, description: text })}
                        />
                        <TextInput
                            style={styles.editTaskInput}
                            placeholder="Категорія"
                            placeholderTextColor="#64748B"
                            value={editedTask?.category}
                            onChangeText={(text) => setEditedTask({ ...editedTask, category: text })}
                        />

                        <TouchableOpacity style={styles.saveButton} onPress={handleSaveTask}>
                            <Text style={styles.saveButtonText}>Ок</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    taskItem: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        alignItems: 'center',
        shadowColor: '#475569',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 10,
        elevation: 3,
    },
    taskInfo: {
        flex: 1,
    },
    taskName: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 2,
    },
    taskDescription: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 4,
    },
    taskCategory: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6366F1',
        textTransform: 'uppercase',
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    editButton: {
        backgroundColor: '#4F46E5',
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: '#EF4444',
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButton: {
        backgroundColor: '#4F46E5',
        width: 64,
        height: 64,
        borderRadius: 32,
        position: 'absolute',
        bottom: 30,
        right: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    editTaskModal: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        justifyContent: 'center',
        padding: 20,
    },
    editTaskContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        padding: 24,
        width: '100%',
    },
    editTaskTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 20,
        textAlign: 'center',
    },
    editTaskInput: {
        height: 56,
        backgroundColor: '#F1F5F9',
        borderRadius: 16,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#1E293B',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    saveButton: {
        backgroundColor: '#4F46E5',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
    flatList: {
        flex: 1,
    }
});

export default TaskListScreen;